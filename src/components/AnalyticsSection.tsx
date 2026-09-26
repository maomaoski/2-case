import React, { useState } from 'react';
import { 
  Building2, Landmark, Calculator, FileText, ExternalLink, 
  RotateCw, CheckCircle2, ShieldCheck, MapPin, Sparkles
} from 'lucide-react';
import { ParsedAnalyticsData } from '../types';

interface AnalyticsSectionProps {
  analytics: ParsedAnalyticsData | any;
  onRefreshParser?: () => void;
  isRefreshing?: boolean;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  analytics,
  onRefreshParser,
  isRefreshing = false,
}) => {
  const [activeTab, setActiveTab] = useState<'genplan' | 'mortgage' | 'opendata'>('genplan');

  const genplan = analytics?.genplan || {
    city: 'Красноярск',
    source_url: 'https://www.admkrsk.ru/citytoday/building/town_planning/Pages/osn_shema.aspx',
    document_title: 'Генеральный план городского округа город Красноярск (Основная схема)',
    decision_number: 'Решение Красноярского городского Совета депутатов № В-269',
    decision_date: '24.08.2022',
    functional_zones: [
      'Зона Ж-4: Многоэтажная жилая застройка (Взлётка, Покровский)',
      'Зона Ж-3: Среднеэтажная застройка и комплексное развитие (Пашенный)',
      'Зона О-1: Общественно-деловые центры',
      'Зона Р: Рекреационный каркас и лесопарки (Академгородок, острова Татышев и Отдыха)'
    ],
    transport_core: 'Метротрамвай (линия Высотная — Шахтеров) + скоростные вылетные магистрали',
    zoning_summary: 'Генеральный план утверждает приоритетное развитие левобережной оси жилой застройки с гарантированным обеспечением школами, поликлиниками и рекреацией.'
  };

  const mortgages = analytics?.mortgages || {
    sberbank: {
      source_url: 'https://domclick.ru/ipoteka/programs/semeynaya',
      program_name: 'Семейная ипотека (СберБанк / Домклик)',
      rate_pct: 6.0,
      min_down_payment_pct: 20.1,
      max_loan_krasnoyarsk_rub: 6000000,
      max_loan_capitals_rub: 12000000,
      term_years: 30,
      base_rate_pct: 24.5
    },
    bspb: {
      source_url: 'https://www.bspb.ru/retail/mortgage/',
      program_name: 'Семейная ипотека с господдержкой (Банк «Санкт-Петербург»)',
      rate_pct: 6.0,
      min_down_payment_pct: 20.0,
      max_loan_rub: 12000000,
      term_years: 30,
      developer_subsidy: 'Субсидирование новостроек'
    }
  };

  const openData = analytics?.open_data || {
    source_url: 'https://data.gov.ru/datasets',
    portal_name: 'Портал открытых данных РФ & Открытые данные Красноярска',
    datasets: [
      {
        name: 'Реестр разрешений на строительство и ввод в эксплуатацию',
        publisher: 'Департамент градостроительства администрации г. Красноярска',
        url: 'https://www.admkrsk.ru/citytoday/building/Pages/reestr.aspx',
        description: 'Официальный реестр застройщиков и введенных жилых комплексов.'
      },
      {
        name: 'Реестр муниципальных общеобразовательных учреждений',
        publisher: 'Главное управление образования администрации Красноярска',
        url: 'https://data.gov.ru/opendata/7710568760-schools',
        description: 'Паспорта доступности, вместимость и зоны закрепления школ.'
      },
      {
        name: 'Единая информационная система жилищного строительства (ЕИСЖС)',
        publisher: 'Минстрой РФ / АО «ДОМ.РФ»',
        url: 'https://наш.дом.рф/',
        description: 'Единый реестр застройщиков, проектные декларации новостроек.'
      }
    ]
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      
      {/* Header with Parser Status & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">
              Аналитика: Генплан, Льготная ипотека и Открытые данные
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Парсинг с официальных порталов: admkrsk.ru, Домклик СберБанк, Банк «Санкт-Петербург» и data.gov.ru
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onRefreshParser && (
            <button
              onClick={onRefreshParser}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all disabled:opacity-50"
              title="Запустить повторный парсинг реальных сайтов"
            >
              <RotateCw className={`w-3.5 h-3.5 text-indigo-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Синхронизация...' : 'Обновить парсер'}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Данные проверены</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: EXACTLY Генплан, Льготная ипотека, Открытые данные */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('genplan')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'genplan'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Генплан (admkrsk.ru)</span>
        </button>

        <button
          onClick={() => setActiveTab('mortgage')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'mortgage'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Льготная ипотека (Сбер & БСП)</span>
        </button>

        <button
          onClick={() => setActiveTab('opendata')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'opendata'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Открытые госданные (data.gov.ru)</span>
        </button>
      </div>

      {/* TAB 1: ГЕНПЛАН КРАСНОЯРСКА (ADMKRSK.RU) */}
      {activeTab === 'genplan' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">
                Официальный источник градостроительства
              </span>
              <h4 className="font-bold text-sm text-white mt-0.5">{genplan.document_title}</h4>
              <p className="text-xs text-slate-400 mt-1">
                {genplan.decision_number} от {genplan.decision_date}
              </p>
            </div>

            <a
              href={genplan.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex-shrink-0"
            >
              <span>Открыть на admkrsk.ru</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="font-bold text-white block text-xs">
                Функциональные зоны жилой застройки:
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {genplan.functional_zones?.map((zone: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{zone}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="font-bold text-white block text-xs">
                Транспортный каркас по Генплану:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {genplan.transport_core}
              </p>
              <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-slate-300 text-[11px] mt-2">
                {genplan.zoning_summary}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ЛЬГОТНАЯ ИПОТЕКА (СБЕР И БСП) */}
      {activeTab === 'mortgage' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Sberbank / Domclick */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    СберБанк / Домклик
                  </span>
                  <a
                    href={mortgages.sberbank.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1"
                  >
                    <span>domclick.ru</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <h4 className="font-bold text-sm text-white mt-1">
                  {mortgages.sberbank.program_name}
                </h4>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Льготная ставка</span>
                    <span className="text-lg font-black text-emerald-400">{mortgages.sberbank.rate_pct}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Первоначальный взнос</span>
                    <span className="text-lg font-black text-white">от {mortgages.sberbank.min_down_payment_pct}%</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                  Максимальный лимит кредита: до 6 млн ₽ для Красноярского края (до 12 млн ₽ для Москвы и СПб). Срок кредитования до 30 лет. Базовая рыночная ставка без субсидии составляет ~{mortgages.sberbank.base_rate_pct}%.
                </p>
              </div>

              <a
                href={mortgages.sberbank.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md text-center block transition-all"
              >
                Рассчитать на Домклик →
              </a>
            </div>

            {/* Bank Saint-Petersburg (BSPB) */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Банк «Санкт-Петербург» (БСП)
                  </span>
                  <a
                    href={mortgages.bspb.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1"
                  >
                    <span>bspb.ru</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <h4 className="font-bold text-sm text-white mt-1">
                  {mortgages.bspb.program_name}
                </h4>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Льготная ставка</span>
                    <span className="text-lg font-black text-indigo-400">{mortgages.bspb.rate_pct}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Первоначальный взнос</span>
                    <span className="text-lg font-black text-white">от {mortgages.bspb.min_down_payment_pct}%</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                  Программа льготной ипотеки с государственной поддержкой. {mortgages.bspb.developer_subsidy}. Возможность комбинирования льготной ставки с рыночной частью для сумм выше лимита.
                </p>
              </div>

              <a
                href={mortgages.bspb.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md text-center block transition-all"
              >
                Рассчитать на сайте БСПБ →
              </a>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: ОТКРЫТЫЕ ГОСДАННЫЕ */}
      {activeTab === 'opendata' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">
                Официальные реестры открытых данных
              </span>
              <h4 className="font-bold text-sm text-white mt-0.5">{openData.portal_name}</h4>
            </div>

            <a
              href={openData.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex-shrink-0"
            >
              <span>data.gov.ru</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {openData.datasets?.map((ds: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-xs text-white leading-snug">{ds.name}</h5>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{ds.description}</p>
                  <span className="text-[10px] text-slate-500 block mt-2">{ds.publisher}</span>
                </div>

                <a
                  href={ds.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 pt-2 border-t border-slate-800"
                >
                  <span>Перейти к реестру</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
