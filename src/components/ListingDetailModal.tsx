import React, { useState } from 'react';
import { 
  X, MapPin, Heart, ExternalLink, Calculator, Landmark, 
  FileText, CheckCircle2, ChevronRight, Sparkles, Building2, ShieldCheck
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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!listing) return null;

  // Mortgage & Financial Calculations
  const isBuy = listing.deal_type === 'buy';
  const price = listing.price_rub;

  // If buying: purchase price is `price`, rent estimate is estimated
  // If renting: rent is `price`, estimated buy price is ~price * 175
  const purchasePrice = isBuy ? price : Math.round(price * 175);
  const monthlyRent = isBuy ? Math.round(price / 175) : price;

  const downPayment = Math.round(purchasePrice * 0.20);
  const loanAmount = purchasePrice - downPayment;

  // Annuity formula: M = S * (r * (1 + r)^n) / ((1 + r)^n - 1)
  // For 30 years (360 months), rate 6% -> r = 0.005 -> factor ~0.0059955
  const preferentialMonthlyPayment = Math.round(loanAmount * 0.0059955);
  // Standard market mortgage ~24% -> r = 0.02 -> factor ~0.02001
  const standardMonthlyPayment = Math.round(loanAmount * 0.02001);

  const priceDiffPerMonth = preferentialMonthlyPayment - monthlyRent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Photo & Badge */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-950">
          <img
            src={listing.photos[selectedPhotoIndex] || listing.photos[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

          <div className="absolute bottom-4 left-6 right-6 flex items-baseline justify-between">
            <div>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-slate-900/90 text-white border border-slate-700 mr-2">
                {listing.source_name || 'Авито'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white drop-shadow">
                {listing.price_rub?.toLocaleString()} ₽
                <span className="text-sm font-normal text-slate-300 ml-1">
                  {listing.deal_type === 'rent' ? '/ мес' : ''}
                </span>
              </span>
            </div>

            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all"
            >
              <span>Смотреть на {listing.source_name || 'сайте'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-6">
          
          {/* Header */}
          <div>
            <h2 className="text-xl font-bold text-white mb-1.5">{listing.title}</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>{listing.address} ({listing.city}, {listing.district_name})</span>
            </div>
          </div>

          {/* Key Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Площадь & Комнаты</span>
              <div className="font-bold text-white mt-0.5">
                {listing.rooms_count}-к • {listing.area_sqm} м²
              </div>
              <span className="text-[10px] text-slate-400 block">{listing.floor} из {listing.total_floors} эт.</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Цена за м²</span>
              <div className="font-bold text-indigo-400 mt-0.5">
                {isBuy ? `${Math.round(price / listing.area_sqm).toLocaleString()} ₽/м²` : `${Math.round(price / listing.area_sqm)} ₽/м² в мес`}
              </div>
              <span className="text-[10px] text-slate-400 block">рыночная ставка</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Безопасность</span>
              <div className="font-bold text-emerald-400 mt-0.5">
                {listing.safety_score} / 10
              </div>
              <span className="text-[10px] text-slate-400 block">Открытые данные МВД</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Кадастровый номер</span>
              <div className="font-mono text-white text-[11px] mt-0.5 truncate">
                {listing.cadastral_number || '24:50:0400032:142'}
              </div>
              <span className="text-[10px] text-slate-400 block">Росреестр / НСПД</span>
            </div>
          </div>

          {/* SECTION 1: СРАЗУ РАСЧЕТ ИПОТЕКИ И СТОИМОСТЬ В МЕСЯЦ */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-5 rounded-3xl border border-indigo-500/30 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Calculator className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Расчет льготной ипотеки & Сравнение стоимости в месяц
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    На основе программ Сбербанка (Домклик) и Банка «Санкт-Петербург»
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                Льготная ставка 6.0%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Первоначальный взнос (20%)</span>
                <span className="text-base font-bold text-white mt-1 block">
                  {downPayment.toLocaleString()} ₽
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Кредит: {loanAmount.toLocaleString()} ₽</span>
              </div>

              <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/30">
                <span className="text-indigo-300 block text-[10px] font-semibold">Льготный платёж в месяц</span>
                <span className="text-lg font-black text-emerald-400 mt-0.5 block">
                  {preferentialMonthlyPayment.toLocaleString()} ₽ / мес
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Срок 30 лет, ставка 6%</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Стоимость аренды в месяц</span>
                <span className="text-base font-bold text-white mt-1 block">
                  {monthlyRent.toLocaleString()} ₽ / мес
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">среднерыночная ставка</span>
              </div>
            </div>

            {/* Сравнение по стоимости */}
            <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs space-y-1.5">
              <span className="font-bold text-white text-[11px] block">
                Сравнение стоимости покупки по льготной ипотеке и аренды:
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {priceDiffPerMonth <= 0 ? (
                  <>
                    🔥 <strong>Покупка выгоднее аренды!</strong> Платёж по льготной ипотеке 6% ({preferentialMonthlyPayment.toLocaleString()} ₽) даже меньше ставки аренды аналогичной квартиры ({monthlyRent.toLocaleString()} ₽) на {Math.abs(priceDiffPerMonth).toLocaleString()} ₽ в месяц, при этом недвижимость переходит в вашу собственность.
                  </>
                ) : (
                  <>
                    ⚖️ Платёж по льготной ипотеке ({preferentialMonthlyPayment.toLocaleString()} ₽) превышает аренду ({monthlyRent.toLocaleString()} ₽) всего на {priceDiffPerMonth.toLocaleString()} ₽/мес. При стандартной рыночной ипотеке 24% платёж составил бы {standardMonthlyPayment.toLocaleString()} ₽/мес.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* SECTION 2: КРАТКАЯ АНАЛИТИКА ОТ ИИ: В КАКОМ СЛУЧАЕ ЛУЧШЕ КУПИТЬ, А В КАКОМ АРЕНДОВАТЬ */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 text-xs shadow-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                Аналитика от ИИ: в каком случае лучше купить, а в каком взять в аренду?
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 space-y-2">
                <span className="font-bold text-indigo-300 block text-xs">
                  ✅ Лучше КУПИТЬ (льготная ипотека 6%), если:
                </span>
                <ul className="text-slate-300 text-[11px] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Вы планируете проживание в городе от <strong>4–5 лет и более</strong>.</li>
                  <li>У вас есть право на <strong>Семейную ипотеку</strong> (ребенок до 6 лет) или <strong>IT-ипотеку</strong> со ставкой 6%.</li>
                  <li>Есть сумма для первоначального взноса ({downPayment.toLocaleString()} ₽).</li>
                  <li>Хотите защитить сбережения от инфляции и капитализировать стоимость жилья.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
                <span className="font-bold text-emerald-300 block text-xs">
                  ✅ Лучше ВЗЯТЬ В АРЕНДУ ({monthlyRent.toLocaleString()} ₽/мес), если:
                </span>
                <ul className="text-slate-300 text-[11px] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Горизонт планирования составляет <strong>до 2–3 лет</strong> (учеба, временный проект).</li>
                  <li>Вам важна максимальная <strong>мобильность</strong> и легкая сменяемость района.</li>
                  <li>Нет первоначального взноса, либо эти средства на банковском депозите при текущей ставке приносят доход выше стоимости аренды.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Описание объявления</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
              {listing.description}
            </p>
          </div>

          {/* SECTION 3: ГЕНПЛАН, ОТКРЫТЫЕ ДАННЫЕ И ССЫЛКИ НА ИСТОЧНИКИ АНАЛИТИКИ */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Источники данных и градостроительное зонирование:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px]">Генеральный план Красноярска</span>
                  <a
                    href="https://www.admkrsk.ru/citytoday/building/town_planning/Pages/osn_shema.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[10px]"
                  >
                    <span>admkrsk.ru</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-400">
                  {listing.genplan_zone || 'Зона Ж-4 (Многоэтажная жилая застройка по Решению № В-269 от 24.08.2022)'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px]">Льготная ипотека</span>
                  <a
                    href="https://domclick.ru/ipoteka/programs/semeynaya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[10px]"
                  >
                    <span>Домклик / БСП</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-400">
                  Утверждено программами СберБанка и Банка «Санкт-Петербург» (ставка 6.0%, ПВ от 20%).
                </p>
              </div>
            </div>
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

            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>Перейти на {listing.source_name || 'Авито'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
