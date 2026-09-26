/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Sparkles, MapPin, Search, Bell, BellOff, 
  Flame, LayoutGrid, Send, ShieldCheck, Heart, UserPlus
} from 'lucide-react';
import { ChatAssistant, ChatMessage } from './components/ChatAssistant';
import { FilterBar, FilterState } from './components/FilterBar';
import { YandexMap } from './components/YandexMap';
import { CityCharacteristics } from './components/CityCharacteristics';
import { ListingsGrid } from './components/ListingsGrid';
import { ListingDetailModal } from './components/ListingDetailModal';
import { TinderTab } from './components/TinderTab';
import { PushNotificationToast, PushToastData } from './components/PushNotificationToast';
import { 
  ListingItem, 
  initialListings, 
  krasnoyarskListings, 
  moscowListings, 
  spbListings 
} from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'search' | 'tinder'>('search');
  const [loading, setLoading] = useState<boolean>(false);
  const [allListings, setAllListings] = useState<ListingItem[]>(initialListings);
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [modalListing, setModalListing] = useState<ListingItem | null>(null);
  const [favorites, setFavorites] = useState<number[]>([101, 102]); // pre-liked
  const [currentCity, setCurrentCity] = useState<string>('Красноярск');

  // Push notifications state
  const [pushEnabled, setPushEnabled] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<PushToastData | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    city: 'Красноярск',
    dealType: 'all',
    maxPrice: 40000,
    minSafety: 8.0,
    onlySchools: true,
    selectedDistrict: 'all',
    rooms: 'all',
  });

  // Chat message history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Здравствуйте! Я умный ассистент по подбору недвижимости по всей России (**Красноярск, Москва, Санкт-Петербург**).

Я парсю объявления с **Циан** и **Яндекс.Недвижимости**, сопоставляю их с официальными реестрами **НСПД**, **Росстата**, **2ГИС** и нормативами **СП 42.13330** (радиус доступности школ до 500 м).

Напишите ваш запрос (например: *«хочу снять квартиру в Красноярске не дороже 40 000 около ТРЦ Планета со школой рядом»* или *«снять однушку на Петроградке в Питере до 39 тыс»*). Я подберу реальные варианты, отмечу их на **Яндекс.Карте** и дам подробную характеристику!`,
      timestamp: 'Только что',
    },
  ]);

  // Initial prompt execution on mount
  useEffect(() => {
    handleSendMessage('хочу снять квартиру в Красноярске не дороже 40 000 со школой поблизости');
  }, []);

  // Sync city when filter city changes
  useEffect(() => {
    setCurrentCity(filters.city);
  }, [filters.city]);

  // Push Notification Handler
  const handleTogglePush = async () => {
    if (!pushEnabled) {
      // Turn on
      let granted = false;
      if ('Notification' in window) {
        try {
          const perm = await Notification.requestPermission();
          granted = perm === 'granted';
        } catch (e) {
          // ignore iframe restriction
        }
      }

      setPushEnabled(true);
      const toastData: PushToastData = {
        id: `push-on-${Date.now()}`,
        title: 'Уведомления включены! 🔔',
        body: granted
          ? 'Браузерные push-уведомления активированы. Мы будем присылать похожие квартиры сразу после публикации.'
          : 'Уведомления успешно активированы в приложении. Мы подберем лучшие варианты по вашему запросу.',
        type: 'status',
      };
      setActiveToast(toastData);

      if (granted) {
        try {
          new Notification('GeoRent AI: Уведомления включены', {
            body: 'Вы будете первыми получать оповещения о новых квартирах со школами рядом!',
            icon: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=100&q=80',
          });
        } catch (e) {
          // ignore
        }
      }
    } else {
      // Turn off
      setPushEnabled(false);
      setActiveToast({
        id: `push-off-${Date.now()}`,
        title: 'Уведомления выключены 🔕',
        body: 'Автоматическая рассылка новых объявлений приостановлена.',
        type: 'status',
      });
    }
  };

  // Simulate Push with tailored listings based on last query/city
  const handleSendSimulatedPush = async () => {
    try {
      const res = await fetch('/api/push/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: currentCity,
          max_price: filters.maxPrice,
        }),
      });

      const data = await res.json();
      if (data.notification) {
        const notif = data.notification;
        setActiveToast({
          id: notif.id,
          title: notif.title,
          body: notif.body,
          listing: notif.listing,
          type: 'recommendation',
        });

        // Trigger native notification if available
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(notif.title, {
              body: notif.body,
              icon: notif.listing?.photos?.[0] || '',
            });
          } catch (e) {
            // ignore
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Send message handler
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          filters: {
            city: filters.city,
            deal_type: filters.dealType !== 'all' ? filters.dealType : undefined,
            max_price: filters.maxPrice,
            min_safety: filters.minSafety,
            only_schools: filters.onlySchools,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка поиска');

      if (data.city) {
        setCurrentCity(data.city);
        setFilters((prev) => ({ ...prev, city: data.city }));
      }
      if (data.listings && data.listings.length > 0) {
        setSelectedListing(data.listings[0]);
      }

      // Add assistant response message
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.reply || `Найдено ${data.total_found} объявлений в городе ${data.city || currentCity}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: `Произошла ошибка при обработке запроса: ${err.message}. Попробуйте скорректировать формулировку.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Client-side dynamic filtering over current city listings
  const filteredListings = useMemo(() => {
    return allListings.filter((item) => {
      // City matching
      if (item.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
      // Deal type
      if (filters.dealType !== 'all' && item.deal_type !== filters.dealType) {
        return false;
      }
      // Price ceiling
      if (item.price_rub > filters.maxPrice) {
        return false;
      }
      // Safety threshold
      if (item.safety_score < filters.minSafety) {
        return false;
      }
      // School proximity
      if (filters.onlySchools && item.school_walk_minutes > 5) {
        return false;
      }
      // Rooms count
      if (filters.rooms !== 'all') {
        const r = Number(filters.rooms);
        if (r === 3 && item.rooms_count < 3) return false;
        if (r < 3 && item.rooms_count !== r) return false;
      }
      // District or landmark in selected city
      if (filters.selectedDistrict !== 'all') {
        const queryDist = filters.selectedDistrict.toLowerCase();
        const itemDist = item.district_name.toLowerCase();
        const itemAddr = item.address.toLowerCase();
        const itemLandmarks = item.landmarks?.some((lm) => lm.toLowerCase().includes(queryDist));
        if (!itemDist.includes(queryDist) && !itemAddr.includes(queryDist) && !itemLandmarks) {
          return false;
        }
      }
      return true;
    });
  }, [allListings, filters]);

  // Average price of current pool
  const averagePrice = useMemo(() => {
    if (filteredListings.length === 0) return 38000;
    const sum = filteredListings.reduce((acc, curr) => acc + curr.price_rub, 0);
    return Math.round(sum / filteredListings.length);
  }, [filteredListings]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setFilters({
      city: currentCity,
      dealType: 'all',
      maxPrice: 40000,
      minSafety: 8.0,
      onlySchools: true,
      selectedDistrict: 'all',
      rooms: 'all',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Toast Notification for Push Demo */}
      <PushNotificationToast
        toast={activeToast}
        onClose={() => setActiveToast(null)}
        onOpenListing={(listing) => setModalListing(listing)}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & City */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  GeoRent AI
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  Циан & Яндекс.Карты
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Поиск квартир с парсингом, Яндекс.Картами и нормативами доступности школ (до 500 м)
              </p>
            </div>
          </div>

          {/* Navigation Mode: Search & Map vs Tinder Match */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveView('search')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeView === 'search'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Поиск & Карта</span>
                <span className="sm:hidden">Поиск</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('tinder')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
                  activeView === 'tinder'
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 fill-current text-rose-400" />
                <span>Тиндер & Совместно</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              </button>
            </div>

            {/* Push Notifications Toggle & Trigger Button */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={handleTogglePush}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                  pushEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={pushEnabled ? 'Нажмите для отключения push' : 'Нажмите для включения push'}
              >
                {pushEnabled ? <Bell className="w-3.5 h-3.5 text-emerald-400" /> : <BellOff className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">
                  {pushEnabled ? 'Уведомления включены' : 'Уведомления выключены'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleSendSimulatedPush}
                className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                title="Отправить push-уведомление с похожими квартирами"
              >
                <Send className="w-3 h-3" />
                <span className="hidden sm:inline">Прислать похожие</span>
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {activeView === 'search' ? (
          <>
            {/* Section 1: Chat Assistant */}
            <ChatAssistant
              messages={messages}
              onSendMessage={handleSendMessage}
              loading={loading}
              onSelectPrompt={(p) => handleSendMessage(p)}
            />

            {/* Section 2: Interactive Filter Bar */}
            <FilterBar
              filters={filters}
              onChangeFilters={(f) => setFilters(f)}
              totalFound={filteredListings.length}
              onReset={handleResetFilters}
            />

            {/* Section 3: Yandex Map */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-bold text-white">
                    Интерактивная карта Яндекс: объекты на карте ({filters.city})
                  </h2>
                </div>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Кликайте по меткам на карте для просмотра фото, цены и школы
                </span>
              </div>

              <YandexMap
                listings={filteredListings}
                selectedListing={selectedListing}
                onSelectListing={(item) => setSelectedListing(item)}
                center={
                  filters.city === 'Москва'
                    ? [55.7512, 37.6184]
                    : filters.city === 'Санкт-Петербург'
                    ? [59.9343, 30.3351]
                    : [56.035, 92.88]
                }
                zoom={filters.city === 'Москва' ? 11 : 12}
              />
            </div>

            {/* Section 4: AI Urban & District Characteristics */}
            <CityCharacteristics
              city={filters.city}
              totalFound={filteredListings.length}
              averagePrice={averagePrice}
            />

            {/* Section 5: Listings Cards Grid */}
            <ListingsGrid
              listings={filteredListings}
              selectedListing={selectedListing}
              onSelectListing={(item) => {
                setSelectedListing(item);
                window.scrollTo({ top: 700, behavior: 'smooth' });
              }}
              onOpenModal={(item) => setModalListing(item)}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </>
        ) : (
          /* Section 6: Tinder Mode for Co-living with Friends */
          <TinderTab
            listings={allListings}
            userLikedIds={favorites}
            onToggleLike={toggleFavorite}
            onOpenDetail={(item) => setModalListing(item)}
          />
        )}

      </main>

      {/* Detail Modal */}
      {modalListing && (
        <ListingDetailModal
          listing={modalListing}
          onClose={() => setModalListing(null)}
          isFavorite={favorites.includes(modalListing.id)}
          toggleFavorite={(l) => toggleFavorite(l.id)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GeoRent AI © 2026 — Поиск недвижимости: Красноярск, Москва, Санкт-Петербург</span>
          <span className="text-[11px] text-slate-400">
            Яндекс.Карты API • Циан • НСПД • data.gov.ru • zhit-vmeste.ru • СП 42.13330
          </span>
        </div>
      </footer>

    </div>
  );
}
