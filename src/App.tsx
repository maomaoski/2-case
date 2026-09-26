/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { ChatAssistant, ChatMessage } from './components/ChatAssistant';
import { FilterBar, FilterState } from './components/FilterBar';
import { YandexMap } from './components/YandexMap';
import { AnalyticsSection } from './components/AnalyticsSection';
import { ListingsGrid } from './components/ListingsGrid';
import { ListingDetailModal } from './components/ListingDetailModal';
import { TinderTab } from './components/TinderTab';
import { ComparisonTab } from './components/ComparisonTab';
import { UserProfileModal } from './components/UserProfileModal';
import { PushNotificationToast, PushToastData } from './components/PushNotificationToast';
import { 
  ListingItem, 
  initialListings, 
  initialUsers, 
  initialFriends,
  UserAccount,
  FriendProfile,
  ParsedAnalyticsData
} from './types';

type TabView = 'search' | 'tinder' | 'comparison';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabView>('search');
  const [loading, setLoading] = useState<boolean>(false);
  const [allListings, setAllListings] = useState<ListingItem[]>(initialListings);
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [modalListing, setModalListing] = useState<ListingItem | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('Красноярск');
  const [analyticsData, setAnalyticsData] = useState<ParsedAnalyticsData | null>(null);
  const [isRefreshingParser, setIsRefreshingParser] = useState<boolean>(false);

  // User & Authentication state
  const [currentUser, setCurrentUser] = useState<UserAccount>(initialUsers[0]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [friendsList, setFriendsList] = useState<FriendProfile[]>(initialFriends);
  const [allUsersList, setAllUsersList] = useState<{ username: string; display_name: string }[]>(
    initialUsers.map(u => ({ username: u.username, display_name: u.display_name }))
  );

  // Push notifications state
  const [pushEnabled, setPushEnabled] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<PushToastData | null>(null);

  // Active query-derived filters
  const [activeAiDealType, setActiveAiDealType] = useState<'rent' | 'buy' | null>(null);
  const [queryPoiFilter, setQueryPoiFilter] = useState<{
    requestedSchool: boolean;
    requestedMedical: boolean;
    requestedTransport: boolean;
  }>({
    requestedSchool: false,
    requestedMedical: false,
    requestedTransport: false,
  });

  // Filter state for Search tab (no dealType toggle, no price slider, no safety slider)
  const [filters, setFilters] = useState<FilterState>({
    city: 'Красноярск',
    selectedDistrict: 'all',
    rooms: 'all',
  });

  // Chat message history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Здравствуйте! Я умный ассистент по недвижимости в **Красноярске, Москве и Санкт-Петербурге**.

Я собираю актуальные предложения с **Авито**, рассчитываю **льготную ипотеку (6%) от Сбера и Банка Санкт-Петербург**, сверяю зонирование по **Генеральному плану** и открытым данным.

Напишите ваш запрос (например: *«хочу снять квартиру в Красноярске около ТРЦ Планета»* или *«купить 2-к новостройку под семейную ипотеку»*). Если вам нужна близость к школе, поликлинике или остановке — просто укажите это в запросе!`,
      timestamp: 'Только что',
    },
  ]);

  // Sync city selection globally
  const handleCityChange = (newCity: string) => {
    setSelectedCity(newCity);
    setFilters((prev) => ({ ...prev, city: newCity, selectedDistrict: 'all' }));
  };

  // Fetch parsed analytics on load
  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics/parsed-sources');
      if (res.ok) {
        const data = await res.json();
        if (data.analytics) setAnalyticsData(data.analytics);
      }
    } catch (e) {
      console.warn('Failed to fetch analytics:', e);
    }
  };

  // Refresh parser action
  const handleRefreshParser = async () => {
    setIsRefreshingParser(true);
    try {
      const res = await fetch('/api/parser/refresh', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.analytics) setAnalyticsData(data.analytics);
        setActiveToast({
          id: `toast-${Date.now()}`,
          title: 'Парсер обновлен ✓',
          body: 'Данные с admkrsk.ru, Домклик и data.gov.ru синхронизированы.',
          type: 'status',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshingParser(false);
    }
  };

  // Fetch listings
  const fetchListings = async () => {
    try {
      const res = await fetch('/api/listings');
      if (res.ok) {
        const data = await res.json();
        if (data.listings && data.listings.length > 0) {
          setAllListings(data.listings);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch listings:', e);
    }
  };

  // Fetch user profile and friends
  const fetchUserProfile = async (username: string) => {
    try {
      const res = await fetch(`/api/user/profile?username=${encodeURIComponent(username)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.user) setCurrentUser(data.user);
        if (data.friends) setFriendsList(data.friends);
      }
    } catch (e) {
      console.warn('Failed to fetch user profile:', e);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchAnalytics();
    fetchUserProfile(currentUser.username);
  }, []);

  // Toggle favorite / like on listing
  const handleToggleFavorite = async (listingId: number) => {
    try {
      const res = await fetch('/api/user/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          listingId,
        }),
      });
      const data = await res.json();
      if (res.ok && data.liked_ids) {
        setCurrentUser((prev) => ({
          ...prev,
          liked_listing_ids: data.liked_ids,
        }));
      }
    } catch (e) {
      // Optimistic local fallback
      setCurrentUser((prev) => {
        const exists = prev.liked_listing_ids.includes(listingId);
        const updated = exists
          ? prev.liked_listing_ids.filter((id) => id !== listingId)
          : [...prev.liked_listing_ids, listingId];
        return { ...prev, liked_listing_ids: updated };
      });
    }
  };

  // Send message / NLP Search
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

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
            city: selectedCity,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка запроса');

      // Update AI deal type and POI filters
      if (data.parsed_criteria) {
        setActiveAiDealType(data.parsed_criteria.deal_type || null);
        setQueryPoiFilter({
          requestedSchool: Boolean(data.parsed_criteria.requested_school),
          requestedMedical: Boolean(data.parsed_criteria.requested_medical),
          requestedTransport: Boolean(data.parsed_criteria.requested_transport),
        });

        if (data.parsed_criteria.city && data.parsed_criteria.city !== selectedCity) {
          handleCityChange(data.parsed_criteria.city);
        }
      }

      if (data.listings && data.listings.length > 0) {
        setAllListings((prev) => {
          const ids = new Set(data.listings.map((l: ListingItem) => l.id));
          const rest = prev.filter((l) => !ids.has(l.id));
          return [...data.listings, ...rest];
        });
        setSelectedListing(data.listings[0]);
      }

      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: `Произошла ошибка при обработке запроса: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger Notification Button
  const handleTriggerNotification = async () => {
    try {
      const res = await fetch('/api/push/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: selectedCity }),
      });
      const data = await res.json();
      if (data.notification) {
        setActiveToast({
          id: data.notification.id,
          title: data.notification.title,
          body: data.notification.body,
          type: 'recommendation',
          listing: data.notification.listing,
        });
      }
    } catch (e) {
      setActiveToast({
        id: `notif-${Date.now()}`,
        title: `Уведомления для г. ${selectedCity}`,
        body: 'Новых объявлений на Авито пока нет, мы оповестим вас при появлении.',
        type: 'status',
      });
    }
  };

  // Filter listings for Search Tab
  const filteredListings = useMemo(() => {
    return allListings.filter((item) => {
      // 1. City match
      if (item.city.toLowerCase() !== selectedCity.toLowerCase()) return false;

      // 2. Deal type: ONLY filter if user prompt specified rent or buy!
      if (activeAiDealType && item.deal_type !== activeAiDealType) return false;

      // 3. District
      if (filters.selectedDistrict !== 'all') {
        const normItemDistrict = item.district_name.toLowerCase();
        const normFilterDistrict = filters.selectedDistrict.toLowerCase();
        if (!normItemDistrict.includes(normFilterDistrict)) return false;
      }

      // 4. Rooms
      if (filters.rooms !== 'all') {
        if (filters.rooms === '3+' && item.rooms_count < 3) return false;
        if (filters.rooms !== '3+' && item.rooms_count !== Number(filters.rooms)) return false;
      }

      return true;
    });
  }, [allListings, selectedCity, activeAiDealType, filters]);

  // Liked listings objects for Current User
  const favoriteListings = useMemo(() => {
    return allListings.filter((l) => currentUser.liked_listing_ids.includes(l.id));
  }, [allListings, currentUser.liked_listing_ids]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification Container */}
      <PushNotificationToast
        toast={activeToast}
        onClose={() => setActiveToast(null)}
        onOpenListing={(listing) => setModalListing(listing)}
      />

      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={currentUser.liked_listing_ids.length}
        selectedCity={selectedCity}
        onSelectCity={handleCityChange}
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        pushEnabled={pushEnabled}
        onTogglePush={() => setPushEnabled(!pushEnabled)}
        onTriggerNotification={handleTriggerNotification}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* TAB 1: ПОИСК */}
        {activeTab === 'search' && (
          <>
            {/* Section 1: AI Chat Assistant */}
            <ChatAssistant
              messages={messages}
              onSendMessage={handleSendMessage}
              loading={loading}
              onSelectPrompt={(prompt) => handleSendMessage(prompt)}
            />

            {/* Section 2: Filter Bar */}
            <FilterBar
              filters={filters}
              onChangeFilters={(f) => {
                setFilters(f);
                if (f.city !== selectedCity) setSelectedCity(f.city);
              }}
              totalFound={filteredListings.length}
              onReset={() => {
                setActiveAiDealType(null);
                setQueryPoiFilter({ requestedSchool: false, requestedMedical: false, requestedTransport: false });
                setFilters({ city: selectedCity, selectedDistrict: 'all', rooms: 'all' });
              }}
              activeDealTypeNote={activeAiDealType}
            />

            {/* Section 3: Interactive Yandex Map */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold">📍</span>
                  <h2 className="text-lg font-bold text-white">
                    Интерактивная карта объектов: {selectedCity}
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  Кликните по метке, чтобы посмотреть подробности
                </span>
              </div>

              <YandexMap
                listings={filteredListings}
                selectedListing={selectedListing}
                onSelectListing={(item) => setSelectedListing(item)}
                onOpenModal={(item) => setModalListing(item)}
                city={selectedCity}
                center={
                  selectedCity === 'Москва'
                    ? [55.7512, 37.6184]
                    : selectedCity === 'Санкт-Петербург'
                    ? [59.9343, 30.3351]
                    : [56.035, 92.88]
                }
              />
            </div>

            {/* Section 4: Analytics Section (Генплан, Льготная ипотека, Открытые данные) */}
            <AnalyticsSection
              analytics={analyticsData}
              onRefreshParser={handleRefreshParser}
              isRefreshing={isRefreshingParser}
            />

            {/* Section 5: Real Listings Cards Grid */}
            <ListingsGrid
              listings={filteredListings}
              selectedListing={selectedListing}
              onSelectListing={(item) => {
                setSelectedListing(item);
                window.scrollTo({ top: 580, behavior: 'smooth' });
              }}
              onOpenModal={(item) => setModalListing(item)}
              favorites={currentUser.liked_listing_ids}
              onToggleFavorite={handleToggleFavorite}
              activeQueryFilter={queryPoiFilter}
            />
          </>
        )}

        {/* TAB 2: ТИНДЕР */}
        {activeTab === 'tinder' && (
          <TinderTab
            listings={allListings}
            userLikedIds={currentUser.liked_listing_ids}
            onToggleLike={handleToggleFavorite}
            onOpenDetail={(item) => setModalListing(item)}
            city={selectedCity}
            friends={friendsList}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {/* TAB 3: СРАВНЕНИЕ С ВЫБОРОМ БАЗОВОЙ (ЭТАЛОННОЙ) КВАРТИРЫ */}
        {activeTab === 'comparison' && (
          <ComparisonTab
            favorites={favoriteListings}
            removeFromFavorites={handleToggleFavorite}
            openListingDetail={(item) => setModalListing(item)}
          />
        )}

      </main>

      {/* Listing Detail Modal */}
      <ListingDetailModal
        listing={modalListing}
        onClose={() => setModalListing(null)}
        isFavorite={modalListing ? currentUser.liked_listing_ids.includes(modalListing.id) : false}
        toggleFavorite={(item) => handleToggleFavorite(item.id)}
      />

      {/* User Profile & Registration Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(u) => setCurrentUser(u)}
        likedListings={favoriteListings}
        onOpenListingModal={(item) => setModalListing(item)}
        onToggleLike={handleToggleFavorite}
        friendsList={friendsList}
        onFriendAdded={(newF) => setFriendsList(newF)}
        allUsers={allUsersList}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GeoRent AI © 2026 — Поиск и аналитика недвижимости: Красноярск, Москва, Санкт-Петербург</span>
          <span className="text-[11px] text-slate-400">
            Официальные источники: Генплан admkrsk.ru • СберБанк Домклик • Банк «Санкт-Петербург» • data.gov.ru
          </span>
        </div>
      </footer>

    </div>
  );
}
