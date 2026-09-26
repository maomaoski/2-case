import React, { useState } from 'react';
import { 
  Bell, Play, Clock, Sparkles, CheckCircle2, ShieldCheck, 
  Terminal, Globe2, RefreshCw, Send, Radio
} from 'lucide-react';

interface CrawlerScheduleTabProps {
  onCrawlerSuccess: () => void;
}

export const CrawlerScheduleTab: React.FC<CrawlerScheduleTabProps> = ({ onCrawlerSuccess }) => {
  // Autosearch state
  const [prompt, setPrompt] = useState('хочу снимать квартиру не дороже 40 000 в месяц с школой по близости');
  const [frequencyDays, setFrequencyDays] = useState(1);
  const [autosearchStatus, setAutosearchStatus] = useState<any | null>(null);

  // Crawler state
  const [crawlerRunning, setCrawlerRunning] = useState(false);
  const [crawlerLogs, setCrawlerLogs] = useState<string[]>([
    '[INIT] Proxy rotator connected (CIS / RU resident IPs: 185.220.101.45, 178.62.19.12)',
    '[SCHEDULE] Background daemon active: Next cycle in 1 day',
  ]);

  // Push notifications simulator
  const [pushNotifications, setPushNotifications] = useState<any[]>([
    {
      id: 1,
      time: '10 минут назад',
      title: 'Найдена новая квартира по вашему запросу!',
      body: '1-к квартира 38 м² у Шуваловской гимназии (Раменки). Цена 38 000 ₽/мес. Подходит под ваш фильтр.',
      unread: true,
    }
  ]);

  const handleSetupAutosearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/scheduled-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, frequencyDays }),
      });
      const data = await res.json();
      setAutosearchStatus(data);
      
      // Simulate an incoming push notification
      setPushNotifications(prev => [
        {
          id: Date.now(),
          time: 'Только что',
          title: 'Автопоиск активирован!',
          body: `Мониторинг запущен: каждые ${frequencyDays} дн. нейросеть будет проверять Авито и Циан по запросу "${prompt}".`,
          unread: true
        },
        ...prev
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunCrawler = async () => {
    setCrawlerRunning(true);
    setCrawlerLogs(prev => [
      `[${new Date().toLocaleTimeString()}] [SCRAPER] Запуск обхода Avito & Cian через resident proxy...`,
      ...prev
    ]);

    try {
      const res = await fetch('/api/crawler/trigger', { method: 'POST' });
      const data = await res.json();

      setCrawlerLogs(prev => [
        `[${new Date().toLocaleTimeString()}] [AVITO] Получено 1 новое объявление. Отправлено в Gemini для извлечения тегов.`,
        `[${new Date().toLocaleTimeString()}] [AI TAGGER] Распознана школа № 37 (4 мин), безопасность 9.1/10. Записано в Глобальную БД.`,
        `[${new Date().toLocaleTimeString()}] [COMPLETED] Всего в базе сервиса: ${data.total_listings} объявл.`,
        ...prev
      ]);

      setPushNotifications(prev => [
        {
          id: Date.now(),
          time: 'Только что',
          title: 'Парсер обнаружил новое объявление на Авито!',
          body: '1-к квартира 42 м² у м. Раменки за 39 500 ₽ со школой в 4 минутах пешком.',
          unread: true
        },
        ...prev
      ]);

      onCrawlerSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setCrawlerRunning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span>Killer Features: Автопоиск по расписанию + Парсер Авито / Циан</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Автономный мониторинг и фоновый сбор объявлений
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Приложение автоматически перезапускает ваш поисковый промт раз в 1–2 дня, парсит площадки через прокси и присылает Push-уведомления при появлении подходящих квартир.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Scheduled Autosearch Setup */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Автопоиск по расписанию</h2>
              <p className="text-xs text-slate-400">Сохранение промта и периодический автозапуск</p>
            </div>
          </div>

          <form onSubmit={handleSetupAutosearch} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Сохраненный промт пользователя
              </label>
              <textarea
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">
                Периодичность автопоиска
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFrequencyDays(1)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    frequencyDays === 1
                      ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Раз в 1 день (Каждое утро)
                </button>
                <button
                  type="button"
                  onClick={() => setFrequencyDays(2)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    frequencyDays === 2
                      ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Раз в 2 дня (Базовый тариф)
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Сохранить расписание автопоиска</span>
            </button>
          </form>

          {autosearchStatus && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-emerald-300 text-xs">
              <span className="font-bold">✓ Расписание настроено! </span>
              {autosearchStatus.message}
            </div>
          )}

          {/* Push Notifications Feed */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span>Лента Push-уведомлений (Эмуляция подписки)</span>
            </h3>

            <div className="space-y-2">
              {pushNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-semibold text-emerald-400">GeoRent Push</span>
                    <span>{notif.time}</span>
                  </div>
                  <h4 className="font-bold text-white text-xs">{notif.title}</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{notif.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Crawler Console & Live Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Terminal className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-white">Парсер внешних площадок</h2>
                  <p className="text-xs text-slate-400">Обход Авито, Циан, Домклик с резидентными прокси</p>
                </div>
              </div>

              <button
                onClick={handleRunCrawler}
                disabled={crawlerRunning}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {crawlerRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Сбор...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Запустить парсинг</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Площадки</span>
                <span className="font-bold text-white">Avito, Cian, Домклик</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Прокси-пул</span>
                <span className="font-bold text-emerald-400">Ротируемый (РФ)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">AI-тегирование</span>
                <span className="font-bold text-indigo-400">Gemini 3.8 Flash</span>
              </div>
            </div>

            {/* Terminal Live Output */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Лог работы парсера:</span>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 h-64 overflow-y-auto space-y-1.5">
                {crawlerLogs.map((log, idx) => (
                  <div key={idx} className="leading-tight">
                    <span className="text-emerald-500">$</span> {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
            <strong>Принцип работы:</strong> Парсер собирает сырые карточки с фильтрами, передает их через Proxy API в нейросеть Gemini для достройки недостающих признаков (школы, метро, безопасность), после чего сохраняет в Глобальную БД.
          </div>
        </div>

      </div>

    </div>
  );
};
