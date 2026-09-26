import React from 'react';
import { 
  Building2, Search, Flame, GitCompare, Bell, BellOff, User, MapPin
} from 'lucide-react';
import { UserAccount } from '../types';

interface NavbarProps {
  activeTab: 'search' | 'tinder' | 'comparison';
  setActiveTab: (tab: 'search' | 'tinder' | 'comparison') => void;
  favoritesCount: number;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  currentUser: UserAccount;
  onOpenProfile: () => void;
  pushEnabled?: boolean;
  onTogglePush?: () => void;
  onTriggerNotification?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  favoritesCount,
  selectedCity,
  onSelectCity,
  currentUser,
  onOpenProfile,
  pushEnabled = false,
  onTogglePush,
  onTriggerNotification
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer flex-shrink-0" 
            onClick={() => setActiveTab('search')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                GeoRent AI
              </span>
            </div>
          </div>

          {/* Global City Selector (visible & clickable from ANYWHERE) */}
          <div className="flex items-center gap-1.5 bg-slate-950/90 px-3 py-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">город:</span>
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
            >
              <option value="Красноярск" className="bg-slate-900 text-white">Красноярск</option>
              <option value="Москва" className="bg-slate-900 text-white">Москва</option>
              <option value="Санкт-Петербург" className="bg-slate-900 text-white">Санкт-Петербург</option>
            </select>
          </div>

          {/* Navigation Tabs: EXACTLY Поиск, Тиндер, Сравнение */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Поиск</span>
            </button>

            <button
              onClick={() => setActiveTab('tinder')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
                activeTab === 'tinder'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Flame className="w-4 h-4 fill-current text-rose-400" />
              <span>Тиндер</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping hidden sm:inline"></span>
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
                activeTab === 'comparison'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>Сравнение</span>
              {favoritesCount > 0 && (
                <span className="w-4 h-4 flex items-center justify-center bg-indigo-500 text-white text-[10px] font-bold rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Actions: Уведомления & User Profile */}
          <div className="flex items-center gap-2">
            
            {/* "Уведомления" button (replaces "Тест Push") */}
            <button
              type="button"
              onClick={onTriggerNotification || onTogglePush}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all shadow-sm"
              title="Уведомления о новых квартирах"
            >
              <Bell className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Уведомления</span>
            </button>

            {/* Profile Avatar & Name Button */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all cursor-pointer"
              title="Открыть профиль пользователя"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.display_name}
                className="w-6 h-6 rounded-lg object-cover ring-1 ring-indigo-500/50"
              />
              <span className="text-xs font-semibold text-white max-w-[90px] truncate hidden md:inline">
                {currentUser.display_name}
              </span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
