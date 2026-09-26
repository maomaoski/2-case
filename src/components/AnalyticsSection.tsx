import React, { useState } from 'react';
import { 
  BarChart3, Compass, Sparkles, TrendingUp, ShieldAlert,
  GraduationCap, Train, Landmark, Calculator, ArrowRightLeft,
  FileText, ExternalLink, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';

interface AnalyticsSectionProps {
  analytics: {
    district_analysis?: any;
    future_infrastructure?: any[];
    new_building_comparison?: any[];
    preferential_mortgages?: any[];
    buy_vs_rent?: any;
    rent_closer_vs_farther?: any;
    master_plan_and_open_data?: any;
    sources_citations?: any[];
    uncertainty_notes?: string[];
  };
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ analytics }) => {
  const [activeTab, setActiveTab] = useState<'district' | 'future' | 'mortgage' | 'buyVsRent' | 'closerFarther' | 'masterPlan' | 'risks'>('district');

  const {
    district_analysis,
    future_infrastructure,
    new_building_comparison,
    preferential_mortgages,
    buy_vs_rent,
    rent_closer_vs_farther,
    master_plan_and_open_data,
    sources_citations,
    uncertainty_notes,
  } = analytics;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">
              Глубокая аналитика локации и финансовые модели
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Комплексный анализ: генплан, школы, льготные ипотеки, окупаемость покупки и открытые данные
          </p>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('district')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'district' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Анализ района
          </button>
          <button
            onClick={() => setActiveTab('future')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'future' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Будущая инфраструктура
          </button>
          <button
            onClick={() => setActiveTab('mortgage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'mortgage' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Льготная ипотека
          </button>
          <button
            onClick={() => setActiveTab('buyVsRent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'buyVsRent' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Покупка vs Аренда
          </button>
          <button
            onClick={() => setActiveTab('closerFarther')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'closerFarther' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ближе / Дальше
          </button>
          <button
            onClick={() => setActiveTab('masterPlan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'masterPlan' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Генплан & Открытые данные
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'risks' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Неопределённость
          </button>
        </div>
      </div>

      {/* Tab 1: Анализ района */}
      {activeTab === 'district' && district_analysis && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Индекс безопасности</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-emerald-400">{district_analysis.safety_score}</span>
                <span className="text-xs text-slate-500">/ 10</span>
              </div>
              <span className="text-[10px] text-emerald-500/80 mt-1 block">Статистика МВД Москвы</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Экологический индекс</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-emerald-400">{district_analysis.ecology_score}</span>
                <span className="text-xs text-slate-500">/ 10</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Мосэкомониторинг PM2.5</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Транспортная связь</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-indigo-400">{district_analysis.transport_score}</span>
                <span className="text-xs text-slate-500">/ 10</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">БКЛ + Солнцевская линия</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Ср. ставка аренды</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-white">{district_analysis.avg_rent_sqm} ₽</span>
                <span className="text-xs text-slate-500">/ м²</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Медиана 2026 г.</span>
            </div>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Экспертный вердикт нейросети:
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              {district_analysis.ai_verdict}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4">
              <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="w-4 h-4" />
                Ключевые преимущества локации
              </h5>
              <ul className="space-y-2 text-xs text-slate-300">
                {district_analysis.pros?.map((pro: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-950/20 border border-rose-900/30 rounded-xl p-4">
              <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wide flex items-center gap-1.5 mb-2.5">
                <AlertTriangle className="w-4 h-4" />
                Ограничения и нюансы района
              </h5>
              <ul className="space-y-2 text-xs text-slate-300">
                {district_analysis.cons?.map((con: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Будущая инфраструктура */}
      {activeTab === 'future' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Train className="w-4 h-4 text-indigo-400" />
              План ввода объектов транспортной и социальной инфраструктуры (2026–2028 гг.)
            </h4>
            <span className="text-xs text-slate-400">Источник: Адресная инвестиционная программа Москвы</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {future_infrastructure?.map((infra: any, i: number) => (
              <div key={i} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {infra.project_type}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      Ввод: {infra.expected_launch_year} г.
                    </span>
                  </div>
                  <h5 className="text-sm font-semibold text-white mb-2 leading-snug">
                    {infra.title}
                  </h5>
                  <p className="text-xs text-slate-400 mb-3">
                    Статус: <span className="text-slate-200">{infra.status}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Влияние на капитализацию:</span>
                  <span className="text-emerald-400 font-bold">+{infra.impact_pct}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Сравнение новостроек */}
          {new_building_comparison && (
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-400" />
                Сравнение ключевых новостроек в локации
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {new_building_comparison.map((b: any, idx: number) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{b.complex_name}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                        ЕРЗ: {b.reliability_rating} ★
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-300">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Девелопер</span>
                        <span className="font-medium text-white">{b.developer}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Срок сдачи</span>
                        <span className="font-medium text-white">{b.completion}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Цена за м²</span>
                        <span className="font-medium text-emerald-400">{b.price_sqm.toLocaleString()} ₽</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {b.advantages?.map((adv: string, aIdx: number) => (
                        <span key={aIdx} className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 text-[10px] border border-slate-800">
                          ✓ {adv}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Льготная ипотека */}
      {activeTab === 'mortgage' && preferential_mortgages && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Действующие государственные программы льготной ипотеки (2026 г.)
            </h4>
            <span className="text-xs text-slate-400">Субсидирование Минфина РФ</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {preferential_mortgages.map((prog: any, i: number) => (
              <div key={i} className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-white text-base">{prog.program_name}</h5>
                    <span className="text-xs text-emerald-400 font-semibold">Ставка: {prog.rate_pct}% годовых</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    Господдержка
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Первоначальный взнос</span>
                    <span className="font-bold text-white">{prog.min_down_payment_pct}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Макс. сумма кредита</span>
                    <span className="font-bold text-white">{(prog.max_loan_amount_rub / 1000000).toFixed(0)} млн ₽</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Ежемесячный платеж</span>
                    <span className="font-bold text-emerald-400">{prog.monthly_payment_for_12m.toLocaleString()} ₽</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-slate-400 font-medium block mb-1">Требования к заемщику:</span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{prog.requirements}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Покупка vs Аренда */}
      {activeTab === 'buyVsRent' && buy_vs_rent && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Финансовая модель окупаемости: аренда против покупки в ипотеку
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-900/70 border border-slate-800 p-3.5 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-1">Ставка аренды</span>
                <span className="text-xl font-bold text-white">{buy_vs_rent.monthly_rent_rub.toLocaleString()} ₽ / мес</span>
                <span className="text-[10px] text-slate-500 block mt-1">Без учета индексации</span>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 p-3.5 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-1">Платеж по семейной ипотеке</span>
                <span className="text-xl font-bold text-emerald-400">{buy_vs_rent.monthly_mortgage_rub.toLocaleString()} ₽ / мес</span>
                <span className="text-[10px] text-slate-500 block mt-1">При кредите 9.6 млн ₽ на 30 лет</span>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 p-3.5 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-1">Точка безубыточности</span>
                <span className="text-xl font-bold text-indigo-400">{buy_vs_rent.break_even_years} лет</span>
                <span className="text-[10px] text-slate-500 block mt-1">С учетом роста стоимости актива</span>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></span>
                <div className="text-xs">
                  <span className="font-semibold text-white">Альтернатива депозита: </span>
                  <span className="text-slate-300">{buy_vs_rent.deposit_opportunity_cost}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                <div className="text-xs">
                  <span className="font-semibold text-white">Рекомендация ИИ: </span>
                  <span className="text-slate-300">{buy_vs_rent.ai_recommendation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Аренда ближе/дальше */}
      {activeTab === 'closerFarther' && rent_closer_vs_farther && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
              Трейд-офф: Аренда в центре против аренды у метро в комфортном районе
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Расчет прямой экономии на стоимости аренды за вычетом затрат на дорогу и ценности вашего времени.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Центр (Хамовники/Пресня)</span>
                <span className="text-lg font-bold text-white">{rent_closer_vs_farther.central_price_rub.toLocaleString()} ₽</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Раменки / Зеленая зона</span>
                <span className="text-lg font-bold text-emerald-400">{rent_closer_vs_farther.farther_price_rub.toLocaleString()} ₽</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Прямая экономия в месяц</span>
                <span className="text-lg font-bold text-indigo-400">+{rent_closer_vs_farther.monthly_savings_rub.toLocaleString()} ₽</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/30 text-xs text-slate-200">
              <p className="font-medium">{rent_closer_vs_farther.verdict}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Генплан & Открытые данные */}
      {activeTab === 'masterPlan' && master_plan_and_open_data && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                Генеральный план города до 2035 г.
              </h5>
              <div className="text-xs space-y-2 text-slate-300">
                <p>
                  <strong className="text-white">Зоны КРТ: </strong>
                  {master_plan_and_open_data.krt_zones}
                </p>
                <p>
                  <strong className="text-white">Реновация: </strong>
                  {master_plan_and_open_data.renovation_schedule}
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" />
                Открытые государственные данные
              </h5>
              <div className="text-xs space-y-2 text-slate-300">
                <p>
                  <strong className="text-white">Уровень правонарушений: </strong>
                  {master_plan_and_open_data.crime_rate}
                </p>
                <p>
                  <strong className="text-white">Качество воздуха: </strong>
                  {master_plan_and_open_data.air_quality_pm25}
                </p>
              </div>
            </div>
          </div>

          {/* Источники и ссылки */}
          {sources_citations && (
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
              <h5 className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Верифицированные источники данных:
              </h5>
              <div className="flex flex-wrap gap-2">
                {sources_citations.map((src: any, idx: number) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                  >
                    <span>{src.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 7: Неопределённость */}
      {activeTab === 'risks' && uncertainty_notes && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-5">
            <h4 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Оценка неопределенности и рисков локации
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Факторы внешней среды, которые могут повлиять на арендные ставки или сроки ввода объектов:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {uncertainty_notes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
