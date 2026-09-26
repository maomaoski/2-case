import React from 'react';
import { SlidersHorizontal, MapPin, GraduationCap, ShieldCheck, RotateCcw } from 'lucide-react';

export interface FilterState {
  city: string;
  dealType: 'all' | 'rent' | 'buy';
  maxPrice: number;
  minSafety: number;
  onlySchools: boolean;
  selectedDistrict: string;
  rooms: string;
}

interface FilterBarProps {
  filters: FilterState;
  onChangeFilters: (newFilters: FilterState) => void;
  totalFound: number;
  onReset: () => void;
}

const CITY_DISTRICTS: Record<string, string[]> = {
  'Красноярск': [
    'Все районы',
    'Взлётка',
    'Академгородок',
    'Центр',
    'мкрн Покровский',
    'мкрн Северный',
    'Пашенный / Белые Росы',
    'Студгородок',
  ],
  'Москва': [
    'Все районы',
    'Раменки',
    'Хамовники',
    'Пресненский',
    'Проспект Вернадского',
    'Очаково-Матвеевское',
  ],
  'Санкт-Петербург': [
    'Все районы',
    'Петроградский',
    'Приморский',
    'Василеостровский',
    'Московский',
  ],
};

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  totalFound,
  onReset,
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
            <h3 className="text-sm font-bold text-white">Интерактивные фильтры поиска</h3>
            <p className="text-[11px] text-slate-400">
              Выбирайте город, реальные районы и параметры — список и Яндекс.Карта фильтруются в реальном времени
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Найдено: {totalFound} квартир(ы)
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
        
        {/* City Selector */}
        <div>
          <label className="text-slate-400 font-medium block mb-1">Город поиска</label>
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['Красноярск', 'Москва', 'Санкт-Петербург'].map((cityName) => (
              <button
                key={cityName}
                type="button"
                onClick={() => update({ city: cityName, selectedDistrict: 'all' })}
                className={`py-1.5 px-1 rounded-lg font-medium text-[11px] transition-all truncate ${
                  filters.city === cityName ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cityName === 'Санкт-Петербург' ? 'СПб' : cityName}
              </button>
            ))}
          </div>
        </div>

        {/* Real Districts for Selected City */}
        <div>
          <label className="text-slate-400 font-medium block mb-1">Район / Локация</label>
          <select
            value={filters.selectedDistrict}
            onChange={(e) => update({ selectedDistrict: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            {currentDistricts.map((d, i) => (
              <option key={i} value={d === 'Все районы' ? 'all' : d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Deal Type */}
        <div>
          <label className="text-slate-400 font-medium block mb-1">Тип сделки</label>
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => update({ dealType: 'all' })}
              className={`py-1.5 rounded-lg font-medium transition-all ${
                filters.dealType === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Все
            </button>
            <button
              type="button"
              onClick={() => update({ dealType: 'rent' })}
              className={`py-1.5 rounded-lg font-medium transition-all ${
                filters.dealType === 'rent' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Аренда
            </button>
            <button
              type="button"
              onClick={() => update({ dealType: 'buy' })}
              className={`py-1.5 rounded-lg font-medium transition-all ${
                filters.dealType === 'buy' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Покупка
            </button>
          </div>
        </div>

        {/* Max Price Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-slate-400 font-medium">Макс. цена:</label>
            <span className="font-bold text-white text-[11px]">
              {filters.maxPrice.toLocaleString()} ₽{filters.dealType === 'rent' ? '/мес' : ''}
            </span>
          </div>
          <input
            type="range"
            min={filters.dealType === 'buy' ? 3000000 : 25000}
            max={filters.dealType === 'buy' ? 16000000 : 80000}
            step={filters.dealType === 'buy' ? 200000 : 1000}
            value={filters.maxPrice}
            onChange={(e) => update({ maxPrice: Number(e.target.value) })}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>{filters.dealType === 'buy' ? '3 млн' : '25 тыс'}</span>
            <span>{filters.dealType === 'buy' ? '16 млн' : '80 тыс'}</span>
          </div>
        </div>

        {/* Safety & School Checkbox */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-slate-400 font-medium">Безопасность:</label>
            <span className="font-bold text-emerald-400 text-[11px]">от {filters.minSafety} / 10</span>
          </div>
          <input
            type="range"
            min={7.0}
            max={9.5}
            step={0.1}
            value={filters.minSafety}
            onChange={(e) => update({ minSafety: Number(e.target.value) })}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <label className="flex items-center gap-1.5 cursor-pointer pt-0.5">
            <input
              type="checkbox"
              checked={filters.onlySchools}
              onChange={(e) => update({ onlySchools: e.target.checked })}
              className="w-3.5 h-3.5 rounded text-indigo-600 bg-slate-950 border-slate-700 accent-indigo-500"
            />
            <span className="text-slate-300 font-medium text-[11px]">Школа ≤ 5 мин</span>
          </label>
        </div>

      </div>
    </div>
  );
};
