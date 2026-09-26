import React from 'react';
import { 
  Building2, MapPin, Heart, ExternalLink, GraduationCap, 
  Activity, Bus, ArrowUpRight
} from 'lucide-react';
import { ListingItem } from '../types';

interface ListingsGridProps {
  listings: ListingItem[];
  selectedListing: ListingItem | null;
  onSelectListing: (listing: ListingItem) => void;
  onOpenModal: (listing: ListingItem) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  activeQueryFilter?: {
    requestedSchool?: boolean;
    requestedMedical?: boolean;
    requestedTransport?: boolean;
  };
}

export const ListingsGrid: React.FC<ListingsGridProps> = ({
  listings,
  selectedListing,
  onSelectListing,
  onOpenModal,
  favorites,
  onToggleFavorite,
  activeQueryFilter = {},
}) => {
  if (listings.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
        <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-base font-bold text-white">Квартиры по заданным фильтрам не найдены</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Попробуйте выбрать «Все районы» в фильтрах выше или изменить критерии поиска.
        </p>
      </div>
    );
  }

  const { requestedSchool, requestedMedical, requestedTransport } = activeQueryFilter;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">
            Объявления с реальных сервисов ({listings.length} предложений)
          </h2>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Прямые ссылки на покупку / аренду на Авито
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((item) => {
          const isSelected = selectedListing?.id === item.id;
          const isFav = favorites.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => onSelectListing(item)}
              className={`bg-slate-900 rounded-3xl border overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Photo & Badges */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={item.photos[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 backdrop-blur-md text-white border border-slate-700">
                      {item.source_name || 'Авито'}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.deal_type === 'rent' ? 'Аренда' : 'Покупка'}
                    </span>
                  </div>

                  {/* Favorite Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                      isFav
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-900/70 text-slate-300 hover:text-white'
                    }`}
                    title={isFav ? 'В избранном' : 'Лайкнуть квартиру'}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>

                  {/* Price Banner */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between">
                    <div className="text-xl font-black text-white drop-shadow">
                      {item.price_rub.toLocaleString()} ₽
                      <span className="text-xs font-normal text-slate-300 ml-1">
                        {item.deal_type === 'rent' ? '/ мес' : ''}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700">
                      {item.rooms_count}-к • {item.area_sqm} м²
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{item.address} ({item.district_name})</span>
                  </div>

                  {/* POI HIGHLIGHTS: OUTPUT ONLY IF USER ASKED! */}
                  {requestedSchool && item.nearest_school && (
                    <div className="bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4 flex-shrink-0" />
                          <span>Школа: {item.school_walk_minutes} мин пешком</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-1">
                        {item.nearest_school}
                      </p>
                    </div>
                  )}

                  {requestedMedical && item.nearest_medical && (
                    <div className="bg-blue-950/20 border border-blue-900/40 p-2.5 rounded-xl space-y-1">
                      <div className="flex items-center gap-1 text-xs font-bold text-blue-400">
                        <Activity className="w-4 h-4 flex-shrink-0" />
                        <span>Медицина: {item.medical_walk_minutes || 5} мин пешком</span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-1">
                        {item.nearest_medical}
                      </p>
                    </div>
                  )}

                  {requestedTransport && item.nearest_bus_stop && (
                    <div className="bg-amber-950/20 border border-amber-900/40 p-2.5 rounded-xl space-y-1">
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Bus className="w-4 h-4 flex-shrink-0" />
                        <span>Транспорт: {item.stop_walk_minutes || 3} мин пешком</span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-1">
                        {item.nearest_bus_stop}
                      </p>
                    </div>
                  )}

                  {/* Floor & Building spec summary */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                    <span>Этаж {item.floor} из {item.total_floors}</span>
                    <span className="font-mono text-[11px] text-indigo-400">
                      {item.deal_type === 'buy' ? `${Math.round(item.price_rub / item.area_sqm).toLocaleString()} ₽/м²` : `${Math.round(item.price_rub / item.area_sqm)} ₽/м² в мес`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal(item);
                  }}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all text-center"
                >
                  Подробнее
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all text-center"
                >
                  <span>На {item.source_name || 'Авито'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
