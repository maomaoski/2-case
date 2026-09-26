import React, { useState } from 'react';
import { 
  GitCompare, Trash2, MapPin, Heart, ExternalLink, 
  Sparkles, Check, ArrowRight, ArrowRightLeft, Award, Scale
} from 'lucide-react';
import { ListingItem } from '../types';

interface ComparisonTabProps {
  favorites: ListingItem[];
  removeFromFavorites: (id: number) => void;
  openListingDetail: (listing: ListingItem) => void;
}

export const ComparisonTab: React.FC<ComparisonTabProps> = ({
  favorites,
  removeFromFavorites,
  openListingDetail,
}) => {
  const [benchmarkId, setBenchmarkId] = useState<number>(favorites[0]?.id || 0);

  if (favorites.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
          <GitCompare className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">
          Список понравившихся квартир пуст
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Нажимайте сердечко на карточках квартир во вкладках «Поиск» или «Тиндер», чтобы сравнивать их между собой с выбором эталонного варианта.
        </p>
      </div>
    );
  }

  // Determine benchmark listing (or fallback to first item)
  const benchmark = favorites.find((f) => f.id === benchmarkId) || favorites[0];
  const otherFavorites = favorites.filter((f) => f.id !== benchmark.id);

  const benchmarkPrice = benchmark.price_rub;
  const benchmarkPriceSqm = Math.round(benchmarkPrice / benchmark.area_sqm);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Scale className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white">
              Сравнение понравившихся квартир
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Выберите базовую (эталонную) квартиру, чтобы получить глубокую аналитику по всем остальным вариантам
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Всего в избранном: {favorites.length}
        </div>
      </div>

      {/* BENCHMARK SELECTION ROW */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          1. Выберите эталонную квартиру (нажмите, чтобы назначить эталоном):
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {favorites.map((item) => {
            const isCurrentBenchmark = item.id === benchmark.id;

            return (
              <div
                key={item.id}
                onClick={() => setBenchmarkId(item.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 relative ${
                  isCurrentBenchmark
                    ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <img
                  src={item.photos[0]}
                  alt={item.title}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  {isCurrentBenchmark && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-indigo-300 bg-indigo-500/20 px-1.5 py-0.2 rounded mb-0.5">
                      <Award className="w-3 h-3 text-indigo-400" />
                      <span>Эталон</span>
                    </span>
                  )}
                  <h4 className="font-bold text-xs text-white truncate">{item.title}</h4>
                  <div className="text-xs font-bold text-emerald-400">
                    {item.price_rub.toLocaleString()} ₽{item.deal_type === 'rent' ? '/мес' : ''}
                  </div>
                  <span className="text-[10px] text-slate-400 block">{item.area_sqm} м² • {item.district_name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BENCHMARK CARD DETAILS */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 p-6 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
              <Award className="w-5 h-5 text-indigo-400" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                Выбранная базовая квартира
              </span>
              <h3 className="text-base font-bold text-white">{benchmark.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openListingDetail(benchmark)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              Подробнее об эталоне
            </button>
            <a
              href={benchmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Открыть на сайте источника"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Стоимость:</span>
            <span className="text-lg font-black text-white mt-0.5 block">
              {benchmarkPrice.toLocaleString()} ₽{benchmark.deal_type === 'rent' ? '/мес' : ''}
            </span>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Ставка за м²:</span>
            <span className="text-lg font-black text-indigo-400 mt-0.5 block">
              {benchmarkPriceSqm.toLocaleString()} ₽/м²
            </span>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Площадь & Этаж:</span>
            <span className="text-sm font-bold text-white mt-1 block">
              {benchmark.area_sqm} м² ({benchmark.floor}/{benchmark.total_floors} эт.)
            </span>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Локация:</span>
            <span className="text-xs font-bold text-white mt-1 block truncate">
              {benchmark.district_name}
            </span>
          </div>
        </div>
      </div>

      {/* COMPARATIVE ANALYTICS AGAINST BENCHMARK */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Сравнительная аналитика остальных вариантов относительно эталона:</span>
        </h3>

        {otherFavorites.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-xs text-slate-400 space-y-2">
            <p>У вас выбрана одна квартира. Поставьте лайк еще хотя бы одной квартире в каталоге, чтобы сопоставить их с этим эталоном!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherFavorites.map((item) => {
              const diffPrice = item.price_rub - benchmarkPrice;
              const diffPricePct = Math.round((diffPrice / benchmarkPrice) * 100);
              const diffArea = Number((item.area_sqm - benchmark.area_sqm).toFixed(1));
              const itemPriceSqm = Math.round(item.price_rub / item.area_sqm);
              const diffPriceSqm = itemPriceSqm - benchmarkPriceSqm;

              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top card info */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.photos[0]}
                          alt={item.title}
                          className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">
                            {item.source_name || 'Площадка'} • {item.city}
                          </span>
                          <h4 className="font-bold text-sm text-white truncate">{item.title}</h4>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 truncate">
                            <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                            <span className="truncate">{item.address}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromFavorites(item.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Удалить из сравнения"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Comparative Metrics Delta */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Разница цены</span>
                        <div className={`font-bold mt-1 text-sm ${diffPrice < 0 ? 'text-emerald-400' : diffPrice > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                          {diffPrice === 0 ? 'Такая же' : `${diffPrice > 0 ? '+' : ''}${diffPrice.toLocaleString()} ₽`}
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          {diffPrice === 0 ? '0%' : `${diffPricePct > 0 ? '+' : ''}${diffPricePct}% к эталону`}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Разница площади</span>
                        <div className={`font-bold mt-1 text-sm ${diffArea > 0 ? 'text-emerald-400' : diffArea < 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                          {diffArea === 0 ? 'Одинаковая' : `${diffArea > 0 ? '+' : ''}${diffArea} м²`}
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          Всего: {item.area_sqm} м²
                        </span>
                      </div>

                      <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Ставка за м²</span>
                        <div className={`font-bold mt-1 text-sm ${diffPriceSqm < 0 ? 'text-emerald-400' : diffPriceSqm > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                          {diffPriceSqm === 0 ? 'Одинаковая' : `${diffPriceSqm > 0 ? '+' : ''}${diffPriceSqm.toLocaleString()} ₽/м²`}
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          {diffPriceSqm < 0 ? 'выгоднее эталона' : 'дороже эталона'}
                        </span>
                      </div>
                    </div>

                    {/* AI Comparative Verdict */}
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Сравнительный вывод нейросети:</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {diffPrice < 0 ? (
                          <>
                            💡 Этот вариант <strong>экономит вам {Math.abs(diffPrice).toLocaleString()} ₽{item.deal_type === 'rent' ? '/мес' : ''}</strong> по сравнению с эталоном. {diffArea >= 0 ? `При этом вы получаете на ${diffArea} м² больше пространства.` : 'Отличный выбор, если первоочередной фактор — сокращение ежемесячных расходов.'}
                          </>
                        ) : diffPrice > 0 ? (
                          <>
                            🏢 Этот вариант дороже эталона на <strong>{diffPrice.toLocaleString()} ₽</strong>, но предлагает площадь {item.area_sqm} м² ({item.rooms_count}-комн.) в локации {item.district_name}. {diffPriceSqm < 0 ? 'При этом себестоимость за метр здесь даже выгоднее эталона.' : ''}
                          </>
                        ) : (
                          <>
                            ⚖️ Стоимость совпадает с эталоном. Выбор зависит от предпочтений по этажу ({item.floor} против {benchmark.floor}) и планировке.
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => setBenchmarkId(item.id)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all text-center flex items-center justify-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Сделать эталоном</span>
                    </button>

                    <button
                      onClick={() => openListingDetail(item)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
                    >
                      Подробнее
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      title="Открыть на сайте источника"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
