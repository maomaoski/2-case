import React from 'react';
import { 
  Building2, MapPin, GraduationCap, ShieldCheck, 
  Eye, Heart, ExternalLink, Train, Sparkles, Navigation
} from 'lucide-react';
import { ListingItem } from '../types';

interface ListingsGridProps {
  listings: ListingItem[];
  selectedListing: ListingItem | null;
  onSelectListing: (listing: ListingItem) => void;
  onOpenModal: (listing: ListingItem) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
}

export const ListingsGrid: React.FC<ListingsGridProps> = ({
  listings,
  selectedListing,
  onSelectListing,
  onOpenModal,
  favorites,
  onToggleFavorite,
}) => {
  if (listings.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
        <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-base font-bold text-white">Квартиры по заданным фильтрам не найдены</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Попробуйте увеличить максимальную стоимость или выбрать «Все районы» в фильтрах выше.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">
            Подобранные квартиры ({listings.length} предложений)
          </h2>
        </div>
        <span className="text-xs text-slate-400">
          Кликните по карточке или кнопке навигации для перехода на Яндекс Карту
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
                      {item.source === 'avito' ? 'Авито' : item.source === 'cian' ? 'Циан' : item.source === 'domclick' ? 'Домклик' : 'Собственник'}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.district_name.split('(')[1]?.replace(')', '') || 'Красноярск'}
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
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded-md border border-emerald-800/80">
                      В рынке
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
                    <span className="truncate">{item.address}</span>
                  </div>

                  {/* School Highlight Badge */}
                  <div className="bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4 flex-shrink-0" />
                        <span>Школа {item.school_walk_minutes} мин пешком</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                        Рядом
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-1">
                      {item.nearest_school}
                    </p>
                  </div>

                  {/* Parameters & Safety */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2 rounded-xl border border-slate-800 text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Параметры</span>
                      <span className="font-medium text-white">{item.rooms_count}-к • {item.area_sqm} м² • {item.floor}/{item.total_floors} эт.</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Безопасность</span>
                      <span className="font-bold text-emerald-400">{item.safety_score} / 10</span>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                    "{item.ai_summary}"
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {item.ai_tags?.slice(0, 3).map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-0 border-t border-slate-800/80 mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectListing(item);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>На карте</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal(item);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  Подробнее
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
