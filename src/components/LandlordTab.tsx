import React, { useState } from 'react';
import { 
  PlusCircle, Sparkles, Building2, MapPin, CheckCircle2, 
  Upload, Tag, AlertCircle, ArrowRight
} from 'lucide-react';

interface LandlordTabProps {
  onListingCreated: () => void;
  setActiveTab: (tab: string) => void;
}

export const LandlordTab: React.FC<LandlordTabProps> = ({ onListingCreated, setActiveTab }) => {
  const [address, setAddress] = useState('г. Москва, Ломоносовский проспект, 25к1');
  const [price, setPrice] = useState('39000');
  const [dealType, setDealType] = useState<'rent' | 'buy'>('rent');
  const [rooms, setRooms] = useState('1');
  const [area, setArea] = useState('41');
  const [floor, setFloor] = useState('6');
  const [totalFloors, setTotalFloors] = useState('16');
  const [description, setDescription] = useState(
    'Сдам светлую квартиру на длительный срок. В квартире есть вся мебель, посудомоечная машина, стиральная машина. Рядом школа и зеленый бульвар.'
  );
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
  );

  const [loading, setLoading] = useState(false);
  const [enrichedResult, setEnrichedResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setEnrichedResult(null);

    try {
      const res = await fetch('/api/landlord/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          price_rub: Number(price),
          deal_type: dealType,
          rooms_count: Number(rooms),
          area_sqm: Number(area),
          floor: Number(floor),
          total_floors: Number(totalFloors),
          description,
          photos: [photoUrl],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка добавления объявления');

      setEnrichedResult(data);
      onListingCreated();
    } catch (err: any) {
      setErrorMsg(err.message || 'Произошла ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Поток арендодателя: Утвержденная форма + AI-обогащение</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Размещение объявления с автоматическим AI-обогащением
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Заполните фиксированные поля объекта. Нейросеть Gemini автоматически определит район, метро, школы поблизости, рейтинг безопасности и добавит теги в Глобальную БД.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handlePublish} className="space-y-4">
            
            {/* Deal Type & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Тип предложения</label>
                <select
                  value={dealType}
                  onChange={(e) => setDealType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="rent">Сдать в аренду (в месяц)</option>
                  <option value="buy">Продажа (полная стоимость)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Стоимость (руб.) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="39000"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Адрес объекта <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="г. Москва, ул. Ленина, д. 10"
                />
              </div>
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Комнат</label>
                <select
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white"
                >
                  <option value="1">1 комната / Студия</option>
                  <option value="2">2 комнаты</option>
                  <option value="3">3 комнаты</option>
                  <option value="4">4+ комнат</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Площадь (м²)</label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Этаж</label>
                <input
                  type="number"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Этажей в доме</label>
                <input
                  type="number"
                  value={totalFloors}
                  onChange={(e) => setTotalFloors(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Описание квартиры и условия
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Photo URL */}
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Ссылка на фото</label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/50 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>ИИ анализирует адрес и обогащает тегами...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Опубликовать и обогатить через ИИ</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live AI Enrichment Results Column */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Результат AI-обогащения</span>
            </h3>

            {enrichedResult ? (
              <div className="space-y-3 text-xs animate-in fade-in duration-300">
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-emerald-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Успешно добавлено в Глобальную БД!</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Объявление обогащено геоданными и теперь доступно в общем поиске арендаторов.
                  </p>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Определенный район:</span>
                    <strong className="text-white text-xs">{enrichedResult.enrichment?.inferred_district}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Ближайшее метро:</span>
                    <strong className="text-white text-xs">
                      {enrichedResult.enrichment?.inferred_metro} ({enrichedResult.enrichment?.metro_walk_minutes} мин)
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Школа поблизости:</span>
                    <strong className="text-emerald-400 text-xs">
                      {enrichedResult.enrichment?.inferred_schools?.[0] || 'Школа № 1448'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Индекс безопасности района:</span>
                    <strong className="text-emerald-400 text-xs">{enrichedResult.enrichment?.inferred_safety_score} / 10</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Оценка цены:</span>
                    <span className="text-slate-300 text-xs">{enrichedResult.enrichment?.market_price_evaluation}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 block font-medium">Сгенерированные AI-теги:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {enrichedResult.enrichment?.generated_tags?.map((t: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('search')}
                  className="w-full mt-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Посмотреть в общем поиске</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Building2 className="w-8 h-8 mx-auto opacity-30" />
                <p className="text-xs">
                  Заполните поля и нажмите «Опубликовать». Здесь отобразится отчет ИИ с распознанными школами, районом и оценкой ставки.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
