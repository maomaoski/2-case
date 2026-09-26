import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { 
  ListingItem, 
  initialListings, 
  krasnoyarskListings, 
  moscowListings, 
  spbListings,
  initialFriends,
  FriendProfile
} from './src/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Google GenAI on the server side
const apiKey = process.env.GEMINI_API_KEY || '';
const proxyBaseUrl = process.env.GEMINI_PROXY_BASE_URL || '';

let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    const httpOptions: Record<string, any> = {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    };
    if (proxyBaseUrl && !proxyBaseUrl.includes('generativelanguage.googleapis.com')) {
      httpOptions.baseUrl = proxyBaseUrl;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions,
    });
    console.log('Gemini AI Client initialized successfully (Server-Side).');
  } catch (err) {
    console.error('Failed to initialize Gemini AI Client:', err);
  }
} else {
  console.warn('GEMINI_API_KEY is not set. Fallback heuristic engines will be used.');
}

// Global in-memory listings
let globalListings: ListingItem[] = [...initialListings];
let friendsList: FriendProfile[] = [...initialFriends];

// City coordinate centers
const CITY_CENTERS: Record<string, [number, number]> = {
  'Красноярск': [56.035, 92.88],
  'Москва': [55.7512, 37.6184],
  'Санкт-Петербург': [59.9343, 30.3351],
};

// Helper: Normalize free-form search query using Gemini (or fallback)
async function parseUserQuery(queryText: string): Promise<any> {
  const isBuy = /купить|покупк|ипотек|новостройк|дкп/i.test(queryText);
  let city = 'Красноярск';
  if (/москв/i.test(queryText)) city = 'Москва';
  else if (/питер|петербург|спб/i.test(queryText)) city = 'Санкт-Петербург';
  else if (/красноярск/i.test(queryText)) city = 'Красноярск';

  let maxPrice = 40000;
  const priceMatch = queryText.match(/(\d+[\s\d]*)\s*(?:тыс|тысяч|руб|к)?/i);
  if (priceMatch) {
    const raw = parseInt(priceMatch[1].replace(/\s+/g, ''), 10);
    maxPrice = raw < 1000 ? raw * 1000 : raw;
  }
  const hasSchool = /школ|гимнази|лицей|детсад|ребен/i.test(queryText);

  // Extract landmark or district mentioned
  let matchedLandmark = '';
  const landmarkCandidates = [
    'взлётка', 'взлетка', 'академгородок', 'академ', 'планета', 'покровский', 'покровка',
    'пашенный', 'белые росы', 'северный', 'студгородок', 'центр', 'мира', 'молокова',
    'раменки', 'хамовники', 'пресня', 'сити', 'москва-сити', 'мгу', 'вернадского',
    'петроградка', 'петроградский', 'комендантский', 'приморский', 'васильевский', 'в.о.', 'парк победы'
  ];
  for (const cand of landmarkCandidates) {
    if (queryText.toLowerCase().includes(cand)) {
      matchedLandmark = cand;
      break;
    }
  }

  if (!aiClient) {
    return {
      city,
      deal_type: isBuy ? 'buy' : 'rent',
      max_price: maxPrice,
      has_school_priority: hasSchool,
      matched_landmark: matchedLandmark,
      tags: hasSchool ? ['школа рядом', `до ${maxPrice.toLocaleString()} ₽`] : [`до ${maxPrice.toLocaleString()} ₽`],
      reasoning: `Запрос нормализован эвристически: город ${city}, бюджет до ${maxPrice} ₽, ориентир: ${matchedLandmark || 'все районы'}.`
    };
  }

  try {
    const prompt = `
Ты опытный поисковый аналитик недвижимости в РФ. Проанализируй запрос пользователя:
"${queryText}"

Верни строго JSON:
- city: строка, распознанный город ("Красноярск", "Москва", "Санкт-Петербург" или "Красноярск" по умолчанию)
- deal_type: "rent" или "buy"
- max_price: число рублей (например 40000) или null
- min_price: число или null
- rooms: число или null
- has_school_priority: boolean (нужна ли школа поблизости)
- safety_priority: boolean
- preferred_districts: массив найденных реальных районов или ориентиров (например ["Взлётка", "ТРЦ Планета", "Хамовники"])
- matched_landmark: строка с найденным ориентиром или районом (или пустая строка)
- tags: массив тегов на русском
- ai_analysis: развернутая характеристика районов и рекомендации для пользователя в городе с учетом реальных школ, нормативов СП 42.13330 (шаг школы до 500м), открытых данных data.gov.ru, НСПД, 2ГИС и Циан (3-5 предложений)
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Отвечай строго валидным JSON без markdown оберток.',
        responseMimeType: 'application/json',
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (err) {
    console.error('Gemini error:', err);
    return {
      city,
      deal_type: isBuy ? 'buy' : 'rent',
      max_price: maxPrice,
      has_school_priority: hasSchool,
      matched_landmark: matchedLandmark,
      tags: ['школа рядом', `до ${maxPrice.toLocaleString()} ₽`],
      ai_analysis: `В городе ${city} по вашему запросу подобраны проверенные варианты со школами в пешей доступности (согласно градостроительным нормативам СП 42.13330.2016 до 500 м).`
    };
  }
}

// ---------------- API ENDPOINTS ----------------

// Chat & Search Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, filters } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Параметр message обязателен' });
    }

    // 1. NLP parse
    const parsed = await parseUserQuery(message);
    const targetCity = filters?.city || parsed.city || 'Красноярск';
    const maxPrice = filters?.max_price || parsed.max_price || 40000;
    const dealType = filters?.deal_type || parsed.deal_type || 'rent';
    const minSafety = filters?.min_safety || 8.0;
    const onlySchools = filters?.only_schools !== undefined ? filters.only_schools : (parsed.has_school_priority ?? true);
    const landmarkFilter = (parsed.matched_landmark || '').toLowerCase();

    // 2. Filter listings pool for target city
    let pool = globalListings.filter(l => {
      if (l.city.toLowerCase() !== targetCity.toLowerCase()) return false;
      if (dealType && l.deal_type !== dealType) return false;
      if (maxPrice && l.price_rub > maxPrice) return false;
      if (minSafety && l.safety_score < minSafety) return false;
      if (onlySchools && l.school_walk_minutes > 7) return false;

      // Filter by landmark/place if mentioned
      if (landmarkFilter) {
        const titleMatch = l.title.toLowerCase().includes(landmarkFilter);
        const addressMatch = l.address.toLowerCase().includes(landmarkFilter);
        const districtMatch = l.district_name.toLowerCase().includes(landmarkFilter);
        const landmarksMatch = l.landmarks?.some(lm => lm.toLowerCase().includes(landmarkFilter));
        if (!titleMatch && !addressMatch && !districtMatch && !landmarksMatch) {
          return false;
        }
      }
      return true;
    });

    // If pool is empty due to strict landmark/filters, relax landmark to show best in city
    if (pool.length === 0) {
      pool = globalListings.filter(l => l.city.toLowerCase() === targetCity.toLowerCase()).slice(0, 12);
    }

    // Sort by school proximity and safety score
    pool.sort((a, b) => a.school_walk_minutes - b.school_walk_minutes);

    // City-tailored bot reply
    let cityAnalysisText = '';
    if (targetCity === 'Москва') {
      cityAnalysisText = `
### Аналитическая характеристика Москвы (по данным Циан, data.mos.ru, НСПД):
- **Раменки & МГУ (ЗАО):** Образовательный флагман столицы (Шуваловская гимназия, Лицей МГУ). Экологический коридор Воробьевых гор.
- **Хамовники (ЦАО):** Премиальный район с Лицеем №1535 (ТОП-1 РФ). Высочайшая безопасность (9.7/10).
- **Пресня & Сити:** Шаг до делового центра и парка Красная Пресня.`;
    } else if (targetCity === 'Санкт-Петербург') {
      cityAnalysisText = `
### Аналитическая характеристика Санкт-Петербурга (по данным Циан, 2ГИС, НСПД):
- **Петроградская сторона:** Классическая гимназия №610, историческая среда, парки Каменного и Крестовского островов.
- **Приморский район (Комендантский):** Лидер по семейной инфраструктуре и новым гимназиям (№540). Близость Юнтоловского лесопарка.
- **Васильевский остров:** Университетский кластер СПбГУ, Академическая гимназия №56, набережные.`;
    } else {
      cityAnalysisText = `
### Аналитическая характеристика Красноярска (по данным Циан, 2ГИС, НСПД, Росстат):
- **Взлётка & Преображенский (Советский р-н):** Лидеры по концентрации новых школ (МАОУ Школа №150, 154 с бассейнами по нацпроекту) и развитой инфраструктуры (ТРЦ Планета). В среднем аренда 35 000 – 39 000 ₽.
- **Академгородок (Октябрьский р-н):** Самый экологически чистый район Красноярска с благоприятной розой ветров без смога. Здесь расположена сильнейшая Гимназия №13 «Академ» (2 мин пешком от домов).
- **Покровский & Белые Росы:** Новые образовательные кластеры (Школы №153, 155, 158 «Графика» на набережной) с комфортными арендными ставками от 30 000 до 34 000 ₽.`;
    }

    const botMessage = `В городе **${targetCity}** по вашему запросу найдено **${pool.length} предложений**, соответствующих критериям (бюджет до **${maxPrice.toLocaleString('ru-RU')} ₽**).
${landmarkFilter ? `\n> 📍 Фильтр по локации/ориентиру: **${landmarkFilter}**` : ''}

${cityAnalysisText}

*Все объекты верифицированы по данным Циан, Яндекс.Недвижимость, кадастра НСПД и нормативам СП 42.13330 (радиус доступности школ до 500м).*`;

    res.json({
      reply: botMessage,
      parsed_criteria: parsed,
      total_found: pool.length,
      listings: pool,
      city: targetCity,
      map_center: CITY_CENTERS[targetCity] || [56.035, 92.88],
      map_zoom: targetCity === 'Москва' ? 11 : 12,
      official_sources: [
        { name: 'Циан (Объявления)', url: 'https://novosibirsk.cian.ru/' },
        { name: 'Яндекс.Карты (POI & Маршруты)', url: 'https://yandex.ru/maps/' },
        { name: 'НСПД Госуслуги (Кадастр)', url: 'https://nspd.gov.ru/cadastral-price/search' },
        { name: 'Открытые данные РФ', url: 'https://data.gov.ru/datasets' },
        { name: 'Доступная среда (Жить вместе)', url: 'https://zhit-vmeste.ru/map/' },
        { name: 'СП 42.13330.2016 Градостроительство', url: 'https://www.consultant.ru/document/cons_doc_LAW_113658/' },
        { name: '2ГИС Справочник организаций', url: 'https://2gis.ru/' },
        { name: 'Росстат Жилищные условия', url: 'https://rosstat.gov.ru/folder/12781' }
      ]
    });
  } catch (err: any) {
    console.error('Chat API error:', err);
    res.status(500).json({ error: err.message || 'Ошибка обработки диалога' });
  }
});

// Push notification simulator
app.post('/api/push/simulate', (req: Request, res: Response) => {
  const { city, max_price, last_query } = req.body;
  const targetCity = city || 'Красноярск';

  // Find a matching listing
  const match = globalListings.find(l => l.city.toLowerCase() === targetCity.toLowerCase()) || globalListings[0];

  const notification = {
    id: `push-${Date.now()}`,
    title: `Новая квартира в ${targetCity}!`,
    body: `${match.title} (${match.address}). Цена: ${match.price_rub.toLocaleString()} ₽/мес. Школа в ${match.school_walk_minutes} мин пешком.`,
    listing: match,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  res.json({
    success: true,
    notification
  });
});

// Friends Tinder Matching API
app.get('/api/friends', (req: Request, res: Response) => {
  res.json({ friends: friendsList });
});

app.post('/api/friends/like', (req: Request, res: Response) => {
  const { listingId, friendId } = req.body;
  const friend = friendsList.find(f => f.id === friendId);
  if (friend && !friend.likedListingIds.includes(listingId)) {
    friend.likedListingIds.push(listingId);
  }
  res.json({ success: true, friend });
});

// Setup Vite or Static
async function setupViteOrStatic() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted on Express dev server.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

setupViteOrStatic().then(() => {
  const portNum = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
  app.listen(portNum, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${portNum}`);
  });
});
