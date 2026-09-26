import React from 'react';
import { SlidersHorizontal, RotateCcw, MapPin } from 'lucide-react';

export interface FilterState {
  city: string;
  selectedDistrict: string;
  rooms: string;
}

interface FilterBarProps {
  filters: FilterState;
  onChangeFilters: (newFilters: FilterState) => void;
  totalFound: number;
  onReset: () => void;
  activeDealTypeNote?: 'rent' | 'buy' | null;
}

const CITY_DISTRICTS: Record<string, string[]> = {
  'Красноярск': [
    'Все районы',
    'Взлётка',
    'Академгородок',
    'мкрн Покровский',
    'Пашенный',
    'Центральный',
  ],
  'Москва': [
    'Все районы',
    'Раменки',
    'Очаково-Матвеевское',
    'Хамовники',
    'Пресненский',
  ],
  'Санкт-Петербург': [
    'Все районы',
    'Петроградский район',
    'Приморский район',
    'Московский район',
  ],
};

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  totalFound,
  onReset,
  activeDealTypeNote,
}) => {
  const update = (patch: Partial<FilterState>) => {
    onChangeFilters({ ...filters, ...patch });
  };

  const currentDistricts = CITY_DISTRICTS[filters.city] || CITY_DISTRICTS['Красноярск'];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <SlidersHorizontal className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">Фильтры поиска</h3>
            <p className="text-[11px] text-slate-400">
              Выбор города и районов для поиска квартир с прямыми ссылками на источники
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeDealTypeNote && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {activeDealTypeNote === 'rent' ? 'ИИ фильтр: только аренда' : 'ИИ фильтр: только покупка'}
            </span>
          )}
          <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
            Найдено: {totalFound}
          </span>
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
            title="Сбросить фильтры"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Сброс</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        
        {/* City Selector (Dropdown / Select) */}
        <div>
          <label className="text-slate-400 font-medium block mb-1">Город поиска</label>
          <div className="relative">
            <select
              value={filters.city}
              onChange={(e) => update({ city: e.target.value, selectedDistrict: 'all' })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
            >
              <option value="Красноярск">Красноярск</option>
              <option value="Москва">Москва</option>
              <option value="Санкт-Петербург">Санкт-Петербург</option>
            </select>
          </div>
        </div>

        {/* District Selector (Dropdown / Select) */}
        <div>
          <label className="text-slate-400 font-medium block mb-1">Район / Локация</label>
          <select
            value={filters.selectedDistrict}
            onChange={(e) => update({ selectedDistrict: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {currentDistricts.map((d, i) => (
              <option key={i} value={d === 'Все районы' ? 'all' : d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Rooms Count */}
        <div>
          <label className="text-slate-400 font-medium block mb-1">Количество комнат</label>
          <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['all', '1', '2', '3+'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => update({ rooms: r })}
                className={`py-1.5 rounded-lg font-medium text-xs transition-all ${
                  filters.rooms === r ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'all' ? 'Все' : r}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
