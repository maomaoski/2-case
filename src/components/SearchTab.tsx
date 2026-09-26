import React, { useState } from 'react';
import { 
  Search, SlidersHorizontal, Sparkles, Building2, MapPin, 
  GraduationCap, Train, ShieldCheck, Heart, ExternalLink, 
  ArrowUpDown, Filter, Check, Clock, Home, BadgeCheck
} from 'lucide-react';
import { AnalyticsSection } from './AnalyticsSection';

interface SearchTabProps {
  onSearch: (promptText: string, filters: any) => Promise<void>;
  searchLoading: boolean;
  searchResult: any;
  favorites: any[];
  toggleFavorite: (listing: any) => void;
  openListingDetail: (listing: any) => void;
}

const SAMPLE_QUERIES = [
  'хочу снимать квартиру не дороже 40 000 в месяц с школой по близости',
  'ищу новостройку для семьи под льготную семейную ипотеку до 12 млн рядом с парком',
  'снять 1-к квартиру до 38000 руб с тихим двором и метро в 5 минутах',
  'купить двушку в новостройке от ПИК или Донстрой с чистовой отделкой',
];

export const SearchTab: React.FC<SearchTabProps> = ({
  onSearch,
  searchLoading,
  searchResult,
  favorites,
  toggleFavorite,
  openListingDetail,
}) => {
  const [queryInput, setQueryInput] = useState(
    'хочу снимать квартиру не дороже 40 000 в месяц с школой по близости'
  );
  const [showFilters, setShowFilters] = useState(false);
  const [dealType, setDealType] = useState<'all' | 'rent' | 'buy'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(40000);
  const [minSafetyScore, setMinSafetyScore] = useState<number>(8.5);
  const [onlySchools, setOnlySchools] = useState<boolean>(true);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch(queryInput, {
      max_price: maxPrice,
      min_safety: minSafetyScore,
      only_schools: onlySchools,
      deal_type: dealType !== 'all' ? dealType : undefined,
    });
  };

  const isFav = (id: number) => favorites.some((f) => f.id === id);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Hero Section & Natural Language Input */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="max-w-3xl mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-парсер свободных запросов + Proxy API</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Поиск квартир и аналитика через нейросеть
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Напишите запрос в свободной форме: Gemini нормализует параметры, отсечёт «воду», найдёт объявления с Авито/Циан и проанализирует школы, безопасность и генплан.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={2}
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Например: хочу снимать квартиру не дороже 40 000 в месяц с школой по близости..."
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl py-3.5 pl-4 pr-32 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner resize-none"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="absolute right-3 bottom-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {searchLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Анализ...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Найти с ИИ</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-medium text-slate-400">Быстрые запросы:</span>
            {SAMPLE_QUERIES.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQueryInput(q);
                  onSearch(q, {
                    max_price: q.includes('40 000') ? 40000 : 12000000,
                    min_safety: minSafetyScore,
                    only_schools: onlySchools,
                  });
                }}
                className="text-[11px] bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Filters Toggle & Bar */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showFilters ? 'Скрыть точные фильтры' : 'Показать точные фильтры (цена, школы, безопасность)'}</span>
            </button>

            {showFilters && (
              <div className="mt-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
                {/* Deal Type */}
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">Тип сделки</label>
                  <select
                    value={dealType}
                    onChange={(e) => setDealType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="all">Все предложения</option>
                    <option value="rent">Аренда</option>
                    <option value="buy">Покупка (новостройки)</option>
                  </select>
                </div>

                {/* Max Price */}
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Макс. бюджет: <span className="text-white font-bold">{maxPrice.toLocaleString()} ₽</span>
                  </label>
                  <input
                    type="range"
                    min={25000}
                    max={20000000}
                    step={5000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Min Safety Score */}
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Безопасность района: <span className="text-emerald-400 font-bold">от {minSafetyScore} / 10</span>
                  </label>
                  <input
                    type="range"
                    min={6.0}
                    max={9.5}
                    step={0.1}
                    value={minSafetyScore}
                    onChange={(e) => setMinSafetyScore(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* School Checkbox */}
                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={onlySchools}
                      onChange={(e) => setOnlySchools(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 accent-indigo-500"
                    />
                    <span>Только со школой ≤ 5 мин</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* AI Query Normalization & Recommendation Banner */}
      {searchResult && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                <BadgeCheck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Нормализация запроса нейросетью</h3>
                <p className="text-[11px] text-slate-400">
                  Сущности распознаны, вода отсечена, сформированы критерии ранжирования
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {searchResult.normalized_query?.extracted_tags?.map((t: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <strong className="text-emerald-400">Рекомендация ИИ: </strong>
            {searchResult.ai_recommendations}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-1">
            <div>
              <span className="text-slate-500">Тип сделки:</span>{' '}
              <strong className="text-white uppercase">{searchResult.normalized_query?.deal_type}</strong>
            </div>
            <div>
              <span className="text-slate-500">Порог бюджета:</span>{' '}
              <strong className="text-white">
                {searchResult.normalized_query?.max_price
                  ? `${searchResult.normalized_query.max_price.toLocaleString()} ₽`
                  : 'Любой'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500">Инфраструктура:</span>{' '}
              <strong className="text-emerald-400">
                {searchResult.normalized_query?.required_infrastructure?.join(', ') || 'Школа, Метро'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500">Найдено в базе:</span>{' '}
              <strong className="text-indigo-400">{searchResult.total_found} объявл.</strong>
            </div>
          </div>
        </div>
      )}

      {/* Top Matching Listings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>Топ квартир по вашему запросу</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {searchResult?.top_listings?.length || 0}
            </span>
          </h2>
          <span className="text-xs text-slate-400">
            Ранжировано с учётом близости школ и индекса безопасности
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResult?.top_listings?.map((listing: any) => {
            const isSaved = isFav(listing.id);
            return (
              <div
                key={listing.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/5 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={listing.photos?.[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                    {/* Source Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 backdrop-blur-md text-white border border-slate-700">
                        {listing.source === 'avito' ? 'Авито' : listing.source === 'cian' ? 'Циан' : listing.source === 'domclick' ? 'Домклик' : 'Собственник'}
                      </span>
                      {listing.mortgage_eligible && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-600/90 text-white">
                          Ипотека 6%
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(listing)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                        isSaved
                          ? 'bg-rose-500/90 text-white'
                          : 'bg-slate-900/70 text-slate-300 hover:text-white'
                      }`}
                      title={isSaved ? 'Удалить из сравнения' : 'Добавить в сравнение'}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>

                    {/* Price on Image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between">
                      <div className="text-xl font-black text-white drop-shadow">
                        {listing.price_rub.toLocaleString()} ₽
                        <span className="text-xs font-normal text-slate-300 ml-1">
                          {listing.deal_type === 'rent' ? '/ мес' : ''}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60">
                        В рынке
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-white text-sm line-clamp-1 leading-snug">
                      {listing.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{listing.address}</span>
                    </div>

                    {/* Key Attributes */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Train className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="truncate">{listing.nearest_metro} ({listing.metro_walk_minutes} мин)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">Школа {listing.school_walk_minutes} мин</span>
                      </div>
                    </div>

                    {/* School highlight specifically for user's request */}
                    <div className="text-[11px] text-slate-300 bg-emerald-950/20 border border-emerald-900/30 p-2 rounded-lg flex items-start gap-1.5">
                      <span className="font-bold text-emerald-400">🏫</span>
                      <span className="line-clamp-1">{listing.nearest_school}</span>
                    </div>

                    {/* AI summary */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                      "{listing.ai_summary}"
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {listing.ai_tags?.slice(0, 3).map((tag: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 pt-0 border-t border-slate-800/60 mt-3 flex items-center gap-2">
                  <button
                    onClick={() => openListingDetail(listing)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors text-center"
                  >
                    Подробнее
                  </button>
                  <button
                    onClick={() => toggleFavorite(listing)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSaved
                        ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                        : 'bg-transparent text-slate-400 hover:text-white border-slate-700'
                    }`}
                  >
                    {isSaved ? 'В сравнении ✓' : '+ Сравнить'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Analytics Sections */}
      {searchResult && (
        <AnalyticsSection analytics={searchResult} />
      )}
    </div>
  );
};
