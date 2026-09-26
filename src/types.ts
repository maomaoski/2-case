export interface ListingItem {
  id: number;
  city: 'Красноярск' | 'Москва' | 'Санкт-Петербург' | string;
  title: string;
  deal_type: 'rent' | 'buy';
  source: 'avito' | 'landlord';
  source_name: string;
  url: string;
  price_rub: number;
  rooms_count: number;
  area_sqm: number;
  floor: number;
  total_floors: number;
  address: string;
  district_name: string;
  landmarks: string[];
  latitude: number;
  longitude: number;
  nearest_school: string;
  school_walk_minutes: number;
  nearest_medical?: string;
  medical_walk_minutes?: number;
  nearest_bus_stop?: string;
  stop_walk_minutes?: number;
  safety_score: number;
  photos: string[];
  description: string;
  ai_summary: string;
  ai_tags: string[];
  transport_info: string;
  mortgage_eligible?: boolean;
  cadastral_number?: string;
  accessibility_info?: string;
  genplan_zone?: string;
  verified_sources: string[];
  created_at: string;
}

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  display_name: string;
  avatar: string;
  liked_listing_ids: number[];
  friends: string[]; // usernames
}

export interface FriendProfile {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  budget_max: number;
  preferred_districts: string[];
  likedListingIds: number[];
}

export interface UserMatch {
  listingId: number;
  matchedWith: FriendProfile[];
  timestamp: string;
}

export interface ParsedAnalyticsData {
  genplan: {
    city: string;
    source_url: string;
    document_title: string;
    decision_number: string;
    decision_date: string;
    functional_zones: string[];
    transport_core: string;
    zoning_summary: string;
  };
  mortgages: {
    sberbank: {
      source_url: string;
      program_name: string;
      rate_pct: number;
      min_down_payment_pct: number;
      max_loan_krasnoyarsk_rub: number;
      max_loan_capitals_rub: number;
      term_years: number;
      base_rate_pct: number;
    };
    bspb: {
      source_url: string;
      program_name: string;
      rate_pct: number;
      min_down_payment_pct: number;
      max_loan_rub: number;
      term_years: number;
      developer_subsidy: string;
    };
  };
  open_data: {
    source_url: string;
    portal_name: string;
    datasets: {
      name: string;
      publisher: string;
      url: string;
      description: string;
    }[];
  };
  scraped_timestamp: string;
}

// ----------------- КРАСНОЯРСК (ТОЛЬКО АВИТО) -----------------
export const krasnoyarskListings: ListingItem[] = [
  {
    id: 7833564137,
    city: 'Красноярск',
    title: 'Квартира-студия, 24,2 м², 6/16 эт. (21 000 ₽, забронировано)',
    deal_type: 'rent',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/krasnoyarsk/kvartiry/kvartira-studiya_242_m_616_et._7833564137',
    price_rub: 21000,
    rooms_count: 1,
    area_sqm: 24.2,
    floor: 6,
    total_floors: 16,
    address: 'г. Красноярск, мкр-н Нанжуль-Солнечный, Ольховая ул., 14',
    district_name: 'р-н Советский (Нанжуль-Солнечный)',
    landmarks: ['мкр-н Нанжуль-Солнечный', 'Ольховая ул.', 'Школа 156'],
    latitude: 56.1152,
    longitude: 92.9348,
    nearest_school: 'МАОУ Средняя школа № 156 (Нанжуль-Солнечный)',
    school_walk_minutes: 4,
    nearest_medical: 'Поликлиника в Солнечном',
    medical_walk_minutes: 8,
    nearest_bus_stop: 'Остановка «Ольховая» (350 м)',
    stop_walk_minutes: 4,
    safety_score: 9.0,
    photos: [
      'https://10.img.avito.st/image/1/1.Vdcki7a--T4yK1s_ApYOo2Yq-ziWPP0-lluYNJqI-JyRKPs.-k0hLnn3lUAJRoMVdSN4gh5sbcLamyKBmSLku8BzBPc',
      'https://10.img.avito.st/image/1/1.BP-ubra-qBa4zgoXqnZSi-zPqhAc2awWHL7JHBBtqbQbzao.5z8oLns_m8y8Fxyk7t4QmKU7BSo-SP8WpPCkJ9XsoS0'
    ],
    description: 'Сдаётся студия на длительный срок в новом панельном доме 2022 года постройки. Дом расположен в 350 метрах от остановки. В квартире выполнен косметический ремонт, светлые стены создают уютную атмосферу. Внутри есть вся необходимая мебель: удобные спальные места, кухонный гарнитур с холодильником и обеденный стол. Из техники — стиральная машина. Санузел совмещённый. Балкон выходит во двор, где расположена спортивная площадка.',
    ai_summary: 'Студия в Нанжуль-Солнечном за 21 000 ₽/мес. Новый дом 2022 г., без комиссии, залог 10 000 ₽.',
    ai_tags: ['Авито', 'студия', 'Нанжуль-Солнечный', '21 000 ₽'],
    transport_info: 'Остановка в 350 м, автобусы № 50, 60, 64',
    genplan_zone: 'Зона Ж-4 (Многоэтажная жилая застройка admkrsk.ru)',
    cadastral_number: '24:50:0400032:142',
    accessibility_info: 'Пандус с поручнем, грузопассажирский лифт',
    verified_sources: ['Авито', 'Генплан admkrsk.ru', '2ГИС'],
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 8342146357,
    city: 'Красноярск',
    title: 'Квартира-студия, 22,7 м², 9/9 эт. (25 000 ₽, собственник)',
    deal_type: 'rent',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/krasnoyarsk/kvartiry/kvartira-studiya_227_m_99_et._8342146357',
    price_rub: 25000,
    rooms_count: 1,
    area_sqm: 22.7,
    floor: 9,
    total_floors: 9,
    address: 'г. Красноярск, пр-т Машиностроителей, 31А',
    district_name: 'р-н Ленинский (Верхние Черёмушки)',
    landmarks: ['Верхние Черёмушки', 'пр-т Машиностроителей', 'Школа 31'],
    latitude: 56.0028,
    longitude: 93.0235,
    nearest_school: 'Средняя общеобразовательная школа № 31',
    school_walk_minutes: 5,
    nearest_medical: 'Городская поликлиника №6',
    medical_walk_minutes: 7,
    nearest_bus_stop: 'Конечная «Верхние Черёмушки»',
    stop_walk_minutes: 3,
    safety_score: 8.9,
    photos: [
      'https://70.img.avito.st/image/1/1.N5En47a-m3gxQzl5RZc6tjlDmX6VVJ94lTP6cpngmtqSQJk.c-N4kjT81FIwoTC6FHCpgmerSqTX0BTVZsDMsoZgrsc',
      'https://70.img.avito.st/image/1/1.P6spMLa-k0I_kDFDW0AmizeQkUSbh5dCm-DySJczkuCck5E.xrAcV28sUtDJC6qqWunw0Ljos4L_QQxG0G25YFjo3TY'
    ],
    description: 'Всё Новое! | Собственник. Сдам новую студию. Я собственник, не агентство — комиссии нет. Новый ремонт, новая мебель и техника. 9 этаж из 9, сверху никого. Большой балкон с красивым видом на природу и ночной город. Парковка рядом с домом. Рядом конечная остановка «Верхние черемушки». В квартире есть: кухонный гарнитур, холодильник, плита, телевизор, чайник, стиральная машина, диван, стол со стульями.',
    ai_summary: 'Студия от собственника за 25 000 ₽/мес на пр-те Машиностроителей. Новый ремонт, без комиссии.',
    ai_tags: ['Авито', 'от собственника', 'без комиссии', 'новый ремонт'],
    transport_info: 'Конечная остановка «Верхние Черёмушки», маршруты № 85, 95',
    genplan_zone: 'Зона Ж-4 (Жилая застройка по Решению № В-269)',
    cadastral_number: '24:50:0500018:319',
    accessibility_info: 'Лифт пассажирский, пандус у входа',
    verified_sources: ['Авито', 'Генплан Красноярска admkrsk.ru', '2ГИС'],
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 8367761673,
    city: 'Красноярск',
    title: 'Квартира-студия, 31 м², 21/25 эт. (33 000 ₽)',
    deal_type: 'rent',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/krasnoyarsk/kvartiry/kvartira-studiya_31_m_2125_et._8367761673',
    price_rub: 33000,
    rooms_count: 1,
    area_sqm: 31.0,
    floor: 21,
    total_floors: 25,
    address: 'г. Красноярск, Дудинская ул., 2В',
    district_name: 'р-н Советский (Дудинская)',
    landmarks: ['Дудинская', 'Взлётка', 'Школа 66'],
    latitude: 56.0315,
    longitude: 92.9024,
    nearest_school: 'МАОУ Средняя школа № 66',
    school_walk_minutes: 6,
    nearest_medical: 'Поликлиника взрослая №14',
    medical_walk_minutes: 8,
    nearest_bus_stop: 'Остановка «Дудинская»',
    stop_walk_minutes: 3,
    safety_score: 9.3,
    photos: [
      'https://50.img.avito.st/image/1/1.LboiZ7a-gVM0xyNSdHsbljvHg1WQ0IVTkLfgWZxkgPGXxIM.2LnPbw93gxgMOffY0F-bEmzT1LYcsLLNzma93p-wEK4',
      'https://30.img.avito.st/image/1/1.I3i6CLa-j5GsqC2Q8CxuWqOojZcIv4uRCNjumwQLjjMPq40.SpsVPjCx0HZoL7dbQsRu5ke8y0zDKV-rOO_gKDv4-Ow'
    ],
    description: 'Сдается квартира-студия на длительный срок. Собственник, без комиссий. Двуспальный диван, кондиционер (режим охлаждения и обогрева), телевизор, плита с духовкой, холодильник, микроволновка, чайник, стиральная машина, посуда, утюг, гладильная доска, сушилка. Видовой 21-й этаж.',
    ai_summary: 'Видовая студия 31 м² на 21 этаже на ул. Дудинская за 33 000 ₽/мес. Кондиционер, без комиссии.',
    ai_tags: ['Авито', 'Дудинская', '21 этаж', 'кондиционер'],
    transport_info: 'Остановка «Дудинская», автобусы № 20, 77, 81',
    genplan_zone: 'Зона Ж-5 (Высотная жилая застройка)',
    cadastral_number: '24:50:0400030:844',
    accessibility_info: 'Современная входная группа, 3 скоростных лифта',
    verified_sources: ['Авито', 'Генплан Красноярска', '2ГИС'],
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 8254682996,
    city: 'Красноярск',
    title: '1-к. квартира, 40,4 м², 9/9 эт. (45 000 ₽, дизайнерский ремонт)',
    deal_type: 'rent',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/krasnoyarsk/kvartiry/1-k._kvartira_404_m_99_et._8254682996',
    price_rub: 45000,
    rooms_count: 1,
    area_sqm: 40.4,
    floor: 9,
    total_floors: 9,
    address: 'г. Красноярск, Телевизорный пер., 5А',
    district_name: 'р-н Октябрьский (СМ-Сити)',
    landmarks: ['СМ-Сити', 'пер. Телевизорный', 'Лицей 1'],
    latitude: 56.0278,
    longitude: 92.8021,
    nearest_school: 'Лицей № 1 (Октябрьский район)',
    school_walk_minutes: 5,
    nearest_medical: 'Медицинский центр «Бионика»',
    medical_walk_minutes: 6,
    nearest_bus_stop: 'Остановка «Телевизорный завод»',
    stop_walk_minutes: 4,
    safety_score: 9.5,
    photos: [
      'https://70.img.avito.st/image/1/1.jDHkNba-INjylYLZ8DPfTvqVIt5WgiTYVuVB0lo2IXpRliI.09qTC__cpK9rxw7tuiS3EAvELOv6MAPZBeee1lBfS18',
      'https://40.img.avito.st/image/1/1.8Tlqcba-XdB80f_RBDLbRnTRX9bYxlnQ2KE82tRyXHLf0l8.n3EGYG18zQoR6H3cZbAlLt6M8Xf4rCcpMMaTQ1P8nv4'
    ],
    description: 'Квартира от собственника с дизайнерским ремонтом в новом доме бизнес-класса с закрытой территорией и консьержкой (2025 г постройки застройщик СМ-сити) для проживания паре или соло. В квартире ранее никто не проживал, сдаётся впервые. Верхний этаж с панорамной крышей на балконе, чтобы любоваться ночным небом. Высокие потолки 3 метра. В спальне барельеф — имитация скалы ручной работы.',
    ai_summary: 'Бизнес-класс СМ-Сити: потолки 3 м, дизайнерский ремонт, панорамная крыша, 45 000 ₽/мес.',
    ai_tags: ['Авито', 'СМ-Сити', 'дизайнерский ремонт', 'бизнес-класс'],
    transport_info: 'Остановка «Телевизорный завод», маршруты № 3, 63, 83',
    genplan_zone: 'Зона Ж-4 (Комплексное жилое развитие СМ-Сити)',
    cadastral_number: '24:50:0100015:320',
    accessibility_info: 'Консьерж, видеодомофон, бесступенчатый доступ',
    verified_sources: ['Авито', 'Генплан admkrsk.ru', '2ГИС'],
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 8356553859,
    city: 'Красноярск',
    title: '1-к. квартира, 18 м², 5/5 эт. (16 500 ₽, «секретное объявление»)',
    deal_type: 'rent',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/krasnoyarsk/kvartiry/1-k._kvartira_18_m_55_et._8356553859',
    price_rub: 16500,
    rooms_count: 1,
    area_sqm: 18.0,
    floor: 5,
    total_floors: 5,
    address: 'г. Красноярск, ул. Академика Киренского, 21',
    district_name: 'р-н Октябрьский (Студгородок)',
    landmarks: ['Студгородок', 'ул. Киренского', 'СФУ', 'Гимназия 8'],
    latitude: 56.0215,
    longitude: 92.8150,
    nearest_school: 'Гимназия № 8 Лицеист',
    school_walk_minutes: 3,
    nearest_medical: 'Больница КНЦ СО РАН',
    medical_walk_minutes: 7,
    nearest_bus_stop: 'Остановка «Студгородок»',
    stop_walk_minutes: 2,
    safety_score: 9.1,
    photos: [
      'https://60.img.avito.st/image/1/1.dnOGUraS2prw_EiS5kMWVJ_y2JA4-RiVoPvYmDrTJpvO8kibGPHasjL166g-7xggMvHGhjDx2A.WSjFp0XSSQyD8bSmy6QY5vj9BTtfRRWApeBVzGNHz8s',
      'https://20.img.avito.st/image/1/1.s-GT0LaSHwjlfo0A-ardwIpwHQIte90HtXkdCi9R4wnbcI0JDXMfICd3Ljorbd2yJ3MDFCVzHQ.Dpv9W6dDiq2Fz8US5b8Q6Fip1ZbFUWY2KDzatUtufuU'
    ],
    description: 'Сдается уютная гостинка/студия 18 м² на ул. Академика Киренского («секретное объявление»). Качественный косметический ремонт, свой санузел, душевая кабина, стиральная машина, холодильник, диван. Окна в тихий зеленый двор, рядом остановка общественного транспорта и магазины.',
    ai_summary: 'Бюджетный вариант в Октябрьском районе: 16 500 ₽/мес, СФУ и остановка в паре минут.',
    ai_tags: ['Авито', 'студия', 'бюджетно', 'Октябрьский р-н'],
    transport_info: 'Остановка «Студгородок», автобусы № 12, 63, 83',
    genplan_zone: 'Зона Ж-3 (Жилая застройка Октябрьского района)',
    cadastral_number: '24:50:0100018:412',
    accessibility_info: 'Типовой вход, домофон',
    verified_sources: ['Авито', '2ГИС'],
    created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: 8263992327,
    city: 'Красноярск',
    title: 'Квартира-студия, 28 м², 2/18 эт. (25 000 ₽, агентство, комиссия 60%)',
    deal_type: 'rent',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/krasnoyarsk/kvartiry/kvartira-studiya_28_m_218_et._8263992327',
    price_rub: 25000,
    rooms_count: 1,
    area_sqm: 28.0,
    floor: 2,
    total_floors: 18,
    address: 'г. Красноярск, ул. 78 Добровольческой Бригады, 26',
    district_name: 'Советский р-н (Взлётка)',
    landmarks: ['ТРЦ Планета', 'Арена Север', 'Взлётка'],
    latitude: 56.0475,
    longitude: 92.9080,
    nearest_school: 'МАОУ Школа № 149',
    school_walk_minutes: 4,
    nearest_medical: 'Поликлиника №14',
    medical_walk_minutes: 6,
    nearest_bus_stop: 'Остановка «ТРЦ Планета»',
    stop_walk_minutes: 3,
    safety_score: 9.3,
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Светлая современная студия на Взлётке (агентство, комиссия 60%). В шаговой доступности ТРЦ Планета и ледовый дворец Арена Север. В квартире сделан евроремонт, удобная кухонная зона, большой холодильник, стиральная машина, диван.',
    ai_summary: 'Студия 28 м² в центре Взлётки за 25 000 ₽/мес. ТРЦ Планета в 5 минутах пешком.',
    ai_tags: ['Авито', 'Взлётка', 'ТРЦ Планета', 'евроремонт'],
    transport_info: 'Остановка «ТРЦ Планета», автобусы № 50, 53, 63, 71',
    genplan_zone: 'Зона Ж-4 (Многоэтажная жилая застройка admkrsk.ru)',
    cadastral_number: '24:50:0400032:142',
    accessibility_info: 'Пандус с поручнем, 2 лифта',
    verified_sources: ['Авито', 'Генплан admkrsk.ru', '2ГИС'],
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 8094605003,
    city: 'Красноярск',
    title: 'Квартира-студия, 18 м², 5/5 эт. (25 000 ₽, район ГорДК)',
    deal_type: 'rent',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/krasnoyarsk/kvartiry/kvartira-studiya_18_m_55_et._8094605003',
    price_rub: 25000,
    rooms_count: 1,
    area_sqm: 18.0,
    floor: 5,
    total_floors: 5,
    address: 'г. Красноярск, пр-т Свободный, 48',
    district_name: 'р-н Октябрьский (ГорДК)',
    landmarks: ['ГорДК', 'парк Гагарина', 'пр-т Свободный'],
    latitude: 56.0230,
    longitude: 92.8120,
    nearest_school: 'Гимназия № 3',
    school_walk_minutes: 3,
    nearest_medical: 'Поликлиника №4',
    medical_walk_minutes: 5,
    nearest_bus_stop: 'Остановка «ГорДК»',
    stop_walk_minutes: 2,
    safety_score: 9.2,
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Компактная уютная студия в районе ГорДК на пр-те Свободный. Свежий ремонт, кафель в санузле, мебель, холодильник, стиральная машина. Рядом парк Гагарина, остановка ГорДК, отличная транспортная доступность.',
    ai_summary: 'Студия в районе ГорДК за 25 000 ₽/мес. Рядом парк Гагарина и прямой транспорт в Центр.',
    ai_tags: ['Авито', 'ГорДК', 'Октябрьский р-н', 'парк рядом'],
    transport_info: 'Остановка «ГорДК», трамваи/автобусы во все районы города',
    genplan_zone: 'Зона Ж-3 (Среднеэтажная жилая застройка)',
    cadastral_number: '24:50:0100021:115',
    accessibility_info: 'Домофон, пологий вход',
    verified_sources: ['Авито', '2ГИС'],
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
  {
    id: 1968932346,
    city: 'Красноярск',
    title: '2-к. квартира, 54 м², 13/16 эт. (38 000 ₽, комиссия 50%)',
    deal_type: 'rent',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/krasnoyarsk/kvartiry/2-k._kvartira_54_m_1316_et._1968932346',
    price_rub: 38000,
    rooms_count: 2,
    area_sqm: 54.0,
    floor: 13,
    total_floors: 16,
    address: 'г. Красноярск, ул. Молокова, 12',
    district_name: 'Советский р-н (Взлётка)',
    landmarks: ['ул. Молокова', 'Взлётка-Плаза', 'Парк 400-летия Красноярска'],
    latitude: 56.0450,
    longitude: 92.9140,
    nearest_school: 'МАОУ Школа № 149',
    school_walk_minutes: 4,
    nearest_medical: 'Медицинский центр «Бионика»',
    medical_walk_minutes: 5,
    nearest_bus_stop: 'Остановка «Городок»',
    stop_walk_minutes: 3,
    safety_score: 9.4,
    photos: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Просторная 2-комнатная квартира на Взлётке (комиссия 50%). Раздельные комнаты, большая застекленная лоджия с видом на город. Оснащена всей мебелью и бытовой техникой. В доме 2 лифта, консьерж, видеонаблюдение.',
    ai_summary: 'Двушка 54 м² на Молокова за 38 000 ₽/мес. 13 этаж, раздельные комнаты, развитый район.',
    ai_tags: ['Авито', '2 комнаты', 'Взлётка', 'ул. Молокова'],
    transport_info: 'Остановка «Городок», быстрый выезд на Октябрьский мост',
    genplan_zone: 'Зона Ж-4 (Многоэтажная жилая застройка Взлётки)',
    cadastral_number: '24:50:0400038:512',
    accessibility_info: 'Безбарьерный вход с уровня тротуара, широкие входные группы',
    verified_sources: ['Авито', 'Генплан admkrsk.ru', '2ГИС'],
    created_at: new Date(Date.now() - 3600000 * 16).toISOString(),
  },
  {
    id: 8380984782,
    city: 'Красноярск',
    title: '2-к. квартира, 62,4 м², 13/18 эт. (30 000 ₽, собственник)',
    deal_type: 'rent',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/krasnoyarsk/kvartiry/2-k._kvartira_624_m_1318_et._8380984782',
    price_rub: 30000,
    rooms_count: 2,
    area_sqm: 62.4,
    floor: 13,
    total_floors: 18,
    address: 'г. Красноярск, ул. Караульная, 43',
    district_name: 'Центральный р-н (мкрн Покровский)',
    landmarks: ['мкрн Покровский', 'ул. Караульная', 'ТРЦ ПокровSKY'],
    latitude: 56.0395,
    longitude: 92.8760,
    nearest_school: 'Средняя школа № 153',
    school_walk_minutes: 5,
    nearest_medical: 'Поликлиника №5',
    medical_walk_minutes: 7,
    nearest_bus_stop: 'Остановка «Улица Караульная»',
    stop_walk_minutes: 3,
    safety_score: 9.1,
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Сдам двухкомнатную квартиру от собственника в Покровском. Площадь 62.4 м², комнаты раздельные, просторная кухня, застекленный балкон. Чистый подъезд, тихий двор, удобная транспортная развязка в Центр и на Взлётку.',
    ai_summary: '2-к квартира 62.4 м² от собственника за 30 000 ₽/мес в Покровском. Отличное соотношение цены и метража.',
    ai_tags: ['Авито', 'от собственника', '62.4 м²', 'Покровский'],
    transport_info: 'Остановка «Улица Караульная», 10 мин до центра Красноярска',
    genplan_zone: 'Зона Ж-4 (Многоэтажная жилая застройка Покровского)',
    cadastral_number: '24:50:0300021:105',
    accessibility_info: 'Современный подъемник, грузопассажирский лифт',
    verified_sources: ['Авито', 'Генплан admkrsk.ru', '2ГИС'],
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 8381150259,
    city: 'Красноярск',
    title: '1-к. квартира, 41 м², 1/10 эт. (35 000 ₽, Пихтовая)',
    deal_type: 'rent',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/krasnoyarsk/kvartiry/1-k._kvartira_41_m_110_et._8381150259',
    price_rub: 35000,
    rooms_count: 1,
    area_sqm: 41.0,
    floor: 1,
    total_floors: 10,
    address: 'г. Красноярск, ул. Пихтовая, 57',
    district_name: 'Советский р-н (Пихтовая)',
    landmarks: ['ул. Пихтовая', 'Школа 143', 'мкрн Северный'],
    latitude: 56.0680,
    longitude: 92.9420,
    nearest_school: 'МАОУ Средняя школа № 143',
    school_walk_minutes: 6,
    nearest_medical: 'Поликлиника №1 филиал',
    medical_walk_minutes: 8,
    nearest_bus_stop: 'Остановка «Пихтовая»',
    stop_walk_minutes: 3,
    safety_score: 9.1,
    photos: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Сдается однокомнатная квартира на ул. Пихтовая. Высокий первый этаж, решетки, современный ремонт. Кухонный гарнитур, бытовая техника, стиральная машина, шкаф-купе. Тихий зеленый микрорайон.',
    ai_summary: '1-к квартира 41 м² на ул. Пихтовая за 35 000 ₽/мес. Современный ремонт, высокий 1-й этаж.',
    ai_tags: ['Авито', 'Пихтовая', '1 комната', '41 м²'],
    transport_info: 'Остановка «Пихтовая», автобусы № 8, 79',
    genplan_zone: 'Зона Ж-4 (Жилая застройка по генплану)',
    cadastral_number: '24:50:0400012:903',
    accessibility_info: 'Пологий пандус первого этажа',
    verified_sources: ['Авито', '2ГИС'],
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: 7226154150,
    city: 'Красноярск',
    title: '1-к. квартира, 40,7 м², 15/19 эт. (32 000 ₽, новый дом 2023)',
    deal_type: 'rent',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/krasnoyarsk/kvartiry/1-k._kvartira_407_m_1519_et._7226154150',
    price_rub: 32000,
    rooms_count: 1,
    area_sqm: 40.7,
    floor: 15,
    total_floors: 19,
    address: 'г. Красноярск, ул. Авиаторов, 45',
    district_name: 'Советский р-н (Преображенский)',
    landmarks: ['ЖК Преображенский', 'ТРЦ Планета', 'Лента', 'ул. Авиаторов'],
    latitude: 56.0530,
    longitude: 92.9060,
    nearest_school: 'МАОУ Школа № 154',
    school_walk_minutes: 3,
    nearest_medical: 'Поликлиника взрослая №14',
    medical_walk_minutes: 7,
    nearest_bus_stop: 'Остановка «Улица Авиаторов»',
    stop_walk_minutes: 2,
    safety_score: 9.3,
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Новый дом 2023 года постройки в ЖК Преображенский. Видовой 15-й этаж, светлая чистая квартира с новой мебелью и техникой. ТРЦ Планета и гипермаркет Лента в пешей доступности.',
    ai_summary: 'Новый дом 2023 г. в Преображенском: 1-к 40.7 м² за 32 000 ₽/мес. 15 этаж, ТРЦ Планета рядом.',
    ai_tags: ['Авито', 'новый дом 2023', 'Преображенский', 'видовой этаж'],
    transport_info: 'Остановка «Ул. Авиаторов», прямой выезд на Северное шоссе',
    genplan_zone: 'Зона Ж-5 (Жилая застройка повышенной этажности)',
    cadastral_number: '24:50:0400030:844',
    accessibility_info: 'Широкие холлы, пандус, понижающие площадки',
    verified_sources: ['Авито', 'Генплан Красноярска admkrsk.ru', '2ГИС'],
    created_at: new Date(Date.now() - 3600000 * 22).toISOString(),
  },
  {
    id: 40104,
    city: 'Красноярск',
    title: '2-к. квартира, 62 м², 9/17 эт. в ЖК «Арбан Smart»',
    deal_type: 'buy',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/krasnoyarsk/kvartiry/2-k._kvartira_62_m_917_et._7833564153',
    price_rub: 7200000,
    rooms_count: 2,
    area_sqm: 62.0,
    floor: 9,
    total_floors: 17,
    address: 'г. Красноярск, ул. Караульная, 41',
    district_name: 'Центральный р-н (мкрн Покровский)',
    landmarks: ['ТРЦ ПокровSKY', 'ул. Караульная', 'мкрн Покровский'],
    latitude: 56.0390,
    longitude: 92.8750,
    nearest_school: 'Средняя школа № 153 с IT-классами',
    school_walk_minutes: 5,
    nearest_medical: 'Поликлиника №5',
    medical_walk_minutes: 7,
    nearest_bus_stop: 'Остановка «Улица Караульная»',
    stop_walk_minutes: 2,
    safety_score: 9.1,
    photos: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Просторная двухкомнатная евро-квартира в кирпичном доме от Арбан. Подходит под Семейную ипотеку Сбера и Банка Санкт-Петербург от 6%. Подземный паркинг, колясочные, консьерж, отделка Whitebox.',
    ai_summary: 'Покупка под льготную ипотеку 6%: кирпич Арбан, платеж от 34 500 ₽/мес, цена 7.2 млн ₽.',
    ai_tags: ['Авито', 'покупка', 'Семейная ипотека 6%', 'Арбан'],
    transport_info: 'Остановка «Улица Караульная», быстрый выезд в Центр',
    mortgage_eligible: true,
    genplan_zone: 'Зона Ж-4 (Многоэтажная жилая застройка г. Красноярск)',
    cadastral_number: '24:50:0300021:105',
    accessibility_info: 'Современный подъемник для МГН, пандус 1:12',
    verified_sources: ['Авито', 'СберБанк Домклик', 'Банк СПб', 'Генплан admkrsk.ru'],
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
];

// ----------------- МОСКВА (ТОЛЬКО АВИТО) -----------------
export const moscowListings: ListingItem[] = [
  {
    id: 201,
    city: 'Москва',
    title: '1-к. квартира, 44 м², 9/18 эт. в Раменках у МГУ',
    deal_type: 'rent',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/moskva/kvartiry/1-k._kvartira_44_m_918_et._7833564201',
    price_rub: 52000,
    rooms_count: 1,
    area_sqm: 44.0,
    floor: 9,
    total_floors: 18,
    address: 'г. Москва, Мичуринский проспект, 26',
    district_name: 'ЗАО (Раменки)',
    landmarks: ['МГУ им. Ломоносова', 'м. Раменки', 'парк 50-летия Октября', 'Воробьевы горы'],
    latitude: 55.6980,
    longitude: 37.4980,
    nearest_school: 'Школа № 1448 (Шуваловская гимназия)',
    school_walk_minutes: 4,
    nearest_medical: 'Поликлиника МГУ',
    medical_walk_minutes: 7,
    nearest_bus_stop: 'м. Раменки (выход 2)',
    stop_walk_minutes: 3,
    safety_score: 9.5,
    photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
    description: 'Престижный зеленый район Раменки. Панорамные виды на Воробьевы горы и МГУ. В пешей доступности парк 50-летия Октября, метро Раменки в 3 минутах пешком. Квартира полностью меблирована, есть вся техника.',
    ai_summary: 'ЗАО Раменки: экологический коридор Воробьевых гор, метро 3 мин, аренда 52 000 ₽/мес.',
    ai_tags: ['Авито', 'Раменки', 'МГУ', 'метро 3 мин'],
    transport_info: 'м. Раменки (3 мин пешком), Солнцевская линия',
    genplan_zone: 'Жилая зона повышенной комфортности (Генплан Москвы)',
    cadastral_number: '77:07:0012004:152',
    accessibility_info: 'Современный подъемник, грузовой лифт',
    verified_sources: ['Авито', 'Яндекс.Карты', 'data.gov.ru'],
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 202,
    city: 'Москва',
    title: '2-к. квартира, 58 м², 6/25 эт. в ЖК «Матвеевский парк»',
    deal_type: 'buy',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/moskva/kvartiry/2-k._kvartira_58_m_625_et._7833564202',
    price_rub: 14200000,
    rooms_count: 2,
    area_sqm: 58.0,
    floor: 6,
    total_floors: 25,
    address: 'г. Москва, Очаковское шоссе, 5к1',
    district_name: 'ЗАО (Очаково-Матвеевское)',
    landmarks: ['м. Аминьевская', 'БКЛ', 'Матвеевский кластер'],
    latitude: 55.6920,
    longitude: 37.4640,
    nearest_school: 'Новая школа на 1000 мест во дворе',
    school_walk_minutes: 2,
    nearest_medical: 'Медицинский центр Очаково',
    medical_walk_minutes: 6,
    nearest_bus_stop: 'м. Аминьевская (БКЛ)',
    stop_walk_minutes: 5,
    safety_score: 9.3,
    photos: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
    description: 'Новостройка комфорт+ от ПИК. Действует Семейная ипотека Сбера и Банка Санкт-Петербург 6%. Отделка под ключ, пешеходный бульвар, закрытый двор, скоростное метро БКЛ Аминьевская в 5 мин пешком.',
    ai_summary: 'Покупка в Москве под Семейную ипотеку 6%: метро БКЛ 5 мин, платеж от 58 000 ₽/мес.',
    ai_tags: ['Авито', 'покупка', 'Семейная ипотека 6%', 'БКЛ Аминьевская'],
    transport_info: 'м. Аминьевская (БКЛ и МЦД-4) — 5 мин пешком',
    mortgage_eligible: true,
    genplan_zone: 'Зона комплексного развития территории (КРТ Москвы)',
    cadastral_number: '77:07:0014002:88',
    accessibility_info: 'Полная безбарьерная среда',
    verified_sources: ['Авито', 'Банк СПб', 'ЕИСЖС наш.дом.рф'],
    created_at: new Date(Date.now() - 3600000 * 7).toISOString(),
  }
];

// ----------------- САНКТ-ПЕТЕРБУРГ (ТОЛЬКО АВИТО) -----------------
export const spbListings: ListingItem[] = [
  {
    id: 301,
    city: 'Санкт-Петербург',
    title: '1-к. квартира, 40 м², 3/6 эт. на Петроградской стороне',
    deal_type: 'rent',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/sankt-peterburg/kvartiry/1-k._kvartira_40_m_36_et._7833564301',
    price_rub: 42000,
    rooms_count: 1,
    area_sqm: 40.0,
    floor: 3,
    total_floors: 6,
    address: 'г. Санкт-Петербург, Каменноостровский проспект, 42',
    district_name: 'Петроградский район',
    landmarks: ['м. Петроградская', 'Аптекарский огород', 'Ботанический сад', 'Каменный остров'],
    latitude: 59.9670,
    longitude: 30.3120,
    nearest_school: 'Санкт-Петербургская классическая гимназия № 610',
    school_walk_minutes: 3,
    nearest_medical: 'Первый СПбГМУ им. Павлова',
    medical_walk_minutes: 5,
    nearest_bus_stop: 'м. Петроградская',
    stop_walk_minutes: 2,
    safety_score: 9.4,
    photos: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
    description: 'Аутентичный доходный дом с сохраненными историческими интерьерами и современным евроремонтом. Высокие потолки 3.4 м, тихий закрытый зеленый двор, метро Петроградская в 2 мин пешком. Рядом Ботанический сад и набережная.',
    ai_summary: 'Петроградка: исторический центр, потолки 3.4 м, метро 2 мин, аренда 42 000 ₽/мес.',
    ai_tags: ['Авито', 'Петроградка', 'метро 2 мин', 'потолки 3.4м'],
    transport_info: 'м. Петроградская (2 мин пешком)',
    genplan_zone: 'Зона исторической жилой застройки (КГА СПб)',
    cadastral_number: '78:32:0001502:44',
    accessibility_info: 'Пологий пандус во дворе, домофон с видеосвязью',
    verified_sources: ['Авито', 'Яндекс.Карты', 'data.gov.ru'],
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 302,
    city: 'Санкт-Петербург',
    title: '2-к. квартира, 55 м², 11/24 эт. в ЖК «Чистое Небо»',
    deal_type: 'buy',
    source: 'avito',
    source_name: 'Авито',
    url: 'https://www.avito.ru/sankt-peterburg/kvartiry/2-k._kvartira_55_m_1124_et._7833564302',
    price_rub: 9400000,
    rooms_count: 2,
    area_sqm: 55.0,
    floor: 11,
    total_floors: 24,
    address: 'г. Санкт-Петербург, Комендантский проспект, 66к1',
    district_name: 'Приморский район',
    landmarks: ['м. Комендантский проспект', 'Юнтоловский лесопарк', 'ЗСД'],
    latitude: 60.0310,
    longitude: 30.2240,
    nearest_school: 'Инженерно-технологическая школа № 540',
    school_walk_minutes: 4,
    nearest_medical: 'Поликлиника №115',
    medical_walk_minutes: 7,
    nearest_bus_stop: 'Остановка «Комендантский пр., 66»',
    stop_walk_minutes: 2,
    safety_score: 9.3,
    photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
    description: 'Новый микрорайон в Приморском районе рядом с Юнтоловским лесопарком. Программа Семейной ипотеки Банка Санкт-Петербург и Сбера от 6.0%. Чистовая отделка, застекленная лоджия, благоустроенный двор с игровыми площадками.',
    ai_summary: 'Приморский район СПб: покупка по Семейной ипотеке 6%, Юнтоловский парк, 9.4 млн ₽.',
    ai_tags: ['Авито', 'покупка', 'Семейная ипотека 6%', 'Приморский район'],
    transport_info: 'Автобусы до м. Комендантский проспект (10 мин)',
    mortgage_eligible: true,
    genplan_zone: 'Зона Ж-4 (Многоэтажная жилая застройка СПб)',
    cadastral_number: '78:34:0004281:119',
    accessibility_info: 'Вход без ступеней, лифты OTIS',
    verified_sources: ['Авито', 'Банк СПб', 'ЕИСЖС наш.дом.рф'],
    created_at: new Date(Date.now() - 3600000 * 9).toISOString(),
  }
];

// All initial listings across supported cities (Avito only)
export const initialListings: ListingItem[] = [
  ...krasnoyarskListings,
  ...moscowListings,
  ...spbListings,
];

// Mock friends for Co-living Tinder matching
export const initialFriends: FriendProfile[] = [
  {
    id: 'friend-artem',
    username: 'artem',
    name: 'Артём Смирнов',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Ищу соседа на длительный срок. Люблю порядок, работаю в IT на удаленке. В приоритете Взлётка или Дудинская.',
    budget_max: 40000,
    preferred_districts: ['Взлётка', 'Советский р-н', 'Дудинская'],
    likedListingIds: [7833564137, 8342146357, 8367761673, 8263992327],
  },
  {
    id: 'friend-maria',
    username: 'maria',
    name: 'Мария Васильева',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    bio: 'Студентка магистратуры СФУ. Люблю уютные светлые квартиры с тихим двором и зеленым парком. Рассматриваю Октябрьский р-н и Студгородок.',
    budget_max: 38000,
    preferred_districts: ['Октябрьский р-н', 'Студгородок', 'ГорДК'],
    likedListingIds: [8342146357, 8254682996, 8356553859, 8094605003],
  },
  {
    id: 'friend-daniil',
    username: 'daniil',
    name: 'Даниил Кузнецов',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Инженер-проектировщик. Важна транспортная доступность и тишина вечером. Люблю современные ЖК.',
    budget_max: 42000,
    preferred_districts: ['Советский р-н', 'Преображенский', 'Покровский'],
    likedListingIds: [7833564137, 1968932346, 8380984782, 7226154150],
  }
];

// Seeded app users
export const initialUsers: UserAccount[] = [
  {
    id: 'usr-1',
    username: 'aleks',
    password: '123',
    display_name: 'Алексей',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    liked_listing_ids: [7833564137, 8342146357, 8367761673],
    friends: ['artem', 'maria'],
  },
  {
    id: 'usr-2',
    username: 'artem',
    password: '123',
    display_name: 'Артём Смирнов',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    liked_listing_ids: [7833564137, 8342146357, 8367761673, 8263992327],
    friends: ['aleks'],
  },
  {
    id: 'usr-3',
    username: 'maria',
    password: '123',
    display_name: 'Мария Васильева',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    liked_listing_ids: [8342146357, 8254682996, 8356553859, 8094605003],
    friends: ['aleks'],
  },
  {
    id: 'usr-4',
    username: 'daniil',
    password: '123',
    display_name: 'Даниил Кузнецов',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    liked_listing_ids: [7833564137, 1968932346, 8380984782, 7226154150],
    friends: [],
  }
];
