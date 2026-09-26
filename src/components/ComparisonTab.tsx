import React from 'react';
import { 
  GitCompare, Trash2, MapPin, Train, GraduationCap, 
  ShieldCheck, Calculator, Check, ArrowRight, Download, FileSpreadsheet
} from 'lucide-react';

interface ComparisonTabProps {
  favorites: any[];
  removeFromFavorites: (id: number) => void;
  openListingDetail: (listing: any) => void;
}

export const ComparisonTab: React.FC<ComparisonTabProps> = ({
  favorites,
  removeFromFavorites,
  openListingDetail,
}) => {
  if (favorites.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
          <GitCompare className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">
          Локальная база сравнения пуста
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Нажимайте кнопку «+ Сравнить» на карточках квартир во время поиска, чтобы сопоставить их по цене, удаленности школ, безопасности и финансовой выгоде.
        </p>
      </div>
    );
  }

  const exportComparison = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(favorites, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'georent_comparison_report.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GitCompare className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white">
              Сравнение выбранных квартир (Локальная БД)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Сравнительная матрица по критериям: цена, удаленность школ, безопасность и транспорт
          </p>
        </div>

        <button
          onClick={exportComparison}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>Экспорт отчета (.JSON)</span>
        </button>
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60">
              <th className="p-4 text-xs font-semibold text-slate-400 w-48">Параметр сравнения</th>
              {favorites.map((item) => (
                <th key={item.id} className="p-4 text-xs font-semibold text-white min-w-[260px] max-w-[320px]">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                      {item.source === 'avito' ? 'Авито' : item.source === 'cian' ? 'Циан' : item.source === 'domclick' ? 'Домклик' : 'Собственник'}
                    </span>
                    <button
                      onClick={() => removeFromFavorites(item.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Удалить"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <img
                    src={item.photos?.[0]}
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-xl mb-2"
                  />
                  <h4 className="font-bold text-sm text-white line-clamp-1">{item.title}</h4>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
            {/* Price */}
            <tr>
              <td className="p-4 font-semibold text-slate-400 bg-slate-950/30">Стоимость</td>
              {favorites.map((item) => (
                <td key={item.id} className="p-4 font-bold text-white text-sm">
                  {item.price_rub.toLocaleString()} ₽
                  <span className="text-[11px] text-slate-400 font-normal ml-1">
                    {item.deal_type === 'rent' ? '/ мес' : ''}
                  </span>
                </td>
              ))}
            </tr>

            {/* School accessibility */}
            <tr>
              <td className="p-4 font-semibold text-slate-400 bg-slate-950/30">Школа поблизости</td>
              {favorites.map((item) => (
                <td key={item.id} className="p-4 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 flex-shrink-0" />
                    <span>{item.school_walk_minutes} мин пешком</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block line-clamp-1">
                    {item.nearest_school}
                  </span>
                </td>
              ))}
            </tr>

            {/* Safety Score */}
            <tr>
              <td className="p-4 font-semibold text-slate-400 bg-slate-950/30">Безопасность района</td>
              {favorites.map((item) => (
                <td key={item.id} className="p-4">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                    {item.safety_score} / 10
                  </span>
                </td>
              ))}
            </tr>

            {/* Metro Proximity */}
            <tr>
              <td className="p-4 font-semibold text-slate-400 bg-slate-950/30">Метро и транспорт</td>
              {favorites.map((item) => (
                <td key={item.id} className="p-4 flex items-center gap-1.5 text-slate-200">
                  <Train className="w-4 h-4 text-indigo-400" />
                  <span>{item.nearest_metro} ({item.metro_walk_minutes} мин)</span>
                </td>
              ))}
            </tr>

            {/* Area & Rooms */}
            <tr>
              <td className="p-4 font-semibold text-slate-400 bg-slate-950/30">Параметры квартиры</td>
              {favorites.map((item) => (
                <td key={item.id} className="p-4 text-slate-300">
                  {item.rooms_count}-комн. • {item.area_sqm} м² • {item.floor}/{item.total_floors} эт.
                </td>
              ))}
            </tr>

            {/* AI Summary */}
            <tr>
              <td className="p-4 font-semibold text-slate-400 bg-slate-950/30">Заключение нейросети</td>
              {favorites.map((item) => (
                <td key={item.id} className="p-4 text-[11px] text-slate-300 leading-relaxed italic">
                  "{item.ai_summary}"
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr>
              <td className="p-4 font-semibold text-slate-400 bg-slate-950/30">Действие</td>
              {favorites.map((item) => (
                <td key={item.id} className="p-4">
                  <button
                    onClick={() => openListingDetail(item)}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
                  >
                    Открыть карточку
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};
