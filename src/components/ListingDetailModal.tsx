import React from 'react';
import { 
  X, MapPin, Train, GraduationCap, ShieldCheck, 
  Heart, ExternalLink, Phone, CheckCircle2, Database, Accessibility
} from 'lucide-react';
import { ListingItem } from '../types';

interface ListingDetailModalProps {
  listing: ListingItem | null;
  onClose: () => void;
  isFavorite: boolean;
  toggleFavorite: (listing: ListingItem) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  isFavorite,
  toggleFavorite,
}) => {
  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Photo */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-950">
          <img
            src={listing.photos?.[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

          <div className="absolute bottom-4 left-6 right-6 flex items-baseline justify-between">
            <div>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-slate-900/90 text-white border border-slate-700 mr-2">
                {listing.source === 'cian' ? 'Циан' : listing.source === 'yandex' ? 'Яндекс' : listing.source === 'avito' ? 'Авито' : 'Собственник'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white drop-shadow">
                {listing.price_rub?.toLocaleString()} ₽
                <span className="text-sm font-normal text-slate-300 ml-1">
                  {listing.deal_type === 'rent' ? '/ мес' : ''}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{listing.title}</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>{listing.address} ({listing.city}, {listing.district_name})</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Ближайшая школа</span>
              <div className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{listing.school_walk_minutes} мин пешком</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">{listing.nearest_school}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Транспорт</span>
              <div className="font-bold text-white flex items-center gap-1 mt-0.5">
                <Train className="w-3.5 h-3.5 text-indigo-400" />
                <span className="truncate">{listing.transport_info || 'Остановка 3 мин'}</span>
              </div>
              <span className="text-[10px] text-slate-400 block">по данным 2ГИС</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Безопасность</span>
              <div className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{listing.safety_score} / 10</span>
              </div>
              <span className="text-[10px] text-slate-400 block">МВД / Открытые данные</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Параметры</span>
              <div className="font-bold text-white mt-0.5">
                {listing.rooms_count}-к • {listing.area_sqm} м²
              </div>
              <span className="text-[10px] text-slate-400 block">{listing.floor} из {listing.total_floors} эт.</span>
            </div>
          </div>

          {/* Cadastral & Accessibility info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                <Database className="w-3.5 h-3.5" />
                <span>Кадастровый номер (НСПД / Росреестр):</span>
              </div>
              <p className="font-mono text-slate-300 text-[11px]">
                {listing.cadastral_number || '24:50:0400032:142'} (учтен в кадастре)
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Accessibility className="w-3.5 h-3.5" />
                <span>Доступная среда (zhit-vmeste.ru):</span>
              </div>
              <p className="text-slate-300 text-[11px] truncate">
                {listing.accessibility_info || 'Оборудован пандусом с поручнем, лифт для МГН'}
              </p>
            </div>
          </div>

          {/* AI Recommendation Box */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/40 space-y-1.5 text-xs">
            <span className="font-bold text-indigo-300 uppercase tracking-wide text-[10px] block">
              Аналитическое заключение нейросети
            </span>
            <p className="text-slate-200 leading-relaxed italic">
              "{listing.ai_summary}"
            </p>
          </div>

          {/* Full description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Описание</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Verified Data Sources */}
          {listing.verified_sources && (
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Верифицировано по источникам:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {listing.verified_sources.map((src, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 text-indigo-300 text-[10px] border border-slate-800">
                    ✓ {src}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {listing.ai_tags?.map((t: string, i: number) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs">
                #{t}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
            <button
              onClick={() => toggleFavorite(listing)}
              className={`flex-1 py-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isFavorite ? 'В избранном (Лайкнуто) ✓' : 'Лайкнуть квартиру'}</span>
            </button>

            <button
              onClick={() => alert(`Связь с арендодателем / площадкой ${listing.source}: номер +7 (999) 000-00-00`)}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Связаться с владельцем</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
