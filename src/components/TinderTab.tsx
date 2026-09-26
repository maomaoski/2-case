import React, { useState } from 'react';
import { 
  Flame, Heart, X, Sparkles, Users, GraduationCap, 
  MapPin, ShieldCheck, CheckCircle2, Share2, ArrowRight
} from 'lucide-react';
import { ListingItem, FriendProfile, initialFriends } from '../types';

interface TinderTabProps {
  listings: ListingItem[];
  userLikedIds: number[];
  onToggleLike: (listingId: number) => void;
  onOpenDetail: (listing: ListingItem) => void;
}

export const TinderTab: React.FC<TinderTabProps> = ({
  listings,
  userLikedIds,
  onToggleLike,
  onOpenDetail,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [friends, setFriends] = useState<FriendProfile[]>(initialFriends);
  const [selectedFriendId, setSelectedFriendId] = useState<string>('friend-artem');
  const [lastAction, setLastAction] = useState<'liked' | 'passed' | null>(null);

  const selectedFriend = friends.find((f) => f.id === selectedFriendId) || friends[0];

  // Current deck of cards
  const currentCard = listings[currentIndex % listings.length];

  const handleLike = () => {
    if (!currentCard) return;
    onToggleLike(currentCard.id);
    setLastAction('liked');
    setTimeout(() => {
      setLastAction(null);
      setCurrentIndex((prev) => (prev + 1) % listings.length);
    }, 300);
  };

  const handlePass = () => {
    setLastAction('passed');
    setTimeout(() => {
      setLastAction(null);
      setCurrentIndex((prev) => (prev + 1) % listings.length);
    }, 250);
  };

  // Mutual matches with selected friend
  const mutualListings = listings.filter(
    (l) => userLikedIds.includes(l.id) && selectedFriend.likedListingIds.includes(l.id)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900/40 via-purple-900/30 to-indigo-900/40 border border-rose-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold mb-2">
            <Flame className="w-4 h-4 fill-current text-rose-500" />
            <span>Тиндер для поиска жилья & Совместный съём</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Квартирный Match: подбор жилья вдвоем
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Свайпайте квартиры в формате Тиндера. Когда вы и ваш друг лайкнете один и тот же вариант, появится взаимный Match для совместной аренды или покупки!
          </p>
        </div>

        {/* Selected Friend Selector */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Ищу с:</span>
          <div className="flex items-center gap-2">
            {friends.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFriendId(f.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  selectedFriendId === f.id
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-2 ring-rose-500/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <img src={f.avatar} alt={f.name} className="w-5 h-5 rounded-full object-cover" />
                <span>{f.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Tinder Swipe Card */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {currentCard ? (
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all">
              
              {/* Photo Area */}
              <div className="relative h-80 sm:h-96 w-full bg-slate-950">
                <img
                  src={currentCard.photos[0]}
                  alt={currentCard.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                {/* Top badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-white font-bold text-xs border border-slate-700">
                    {currentCard.city} • {currentCard.district_name}
                  </span>
                </div>

                {/* Friend interest tag */}
                {selectedFriend.likedListingIds.includes(currentCard.id) && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-600/90 text-white text-xs font-bold shadow-lg animate-pulse">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{selectedFriend.name} лайкнул(а)!</span>
                  </div>
                )}

                {/* Price on Image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-3xl font-black text-white drop-shadow">
                    {currentCard.price_rub.toLocaleString()} ₽
                    <span className="text-sm font-normal text-slate-300 ml-1">
                      {currentCard.deal_type === 'rent' ? '/ мес' : ''}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1 line-clamp-1">
                    {currentCard.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-300 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentCard.address}</span>
                  </div>
                </div>
              </div>

              {/* Card Meta details */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <GraduationCap className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Школа: {currentCard.school_walk_minutes} мин</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <span>Безопасность: {currentCard.safety_score} / 10</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{currentCard.ai_summary}"
                </p>

                {/* Action Buttons: Pass & Like */}
                <div className="pt-2 flex items-center justify-center gap-6">
                  <button
                    type="button"
                    onClick={handlePass}
                    className="w-16 h-16 rounded-full bg-slate-800 hover:bg-rose-950/50 border border-slate-700 hover:border-rose-500 text-slate-400 hover:text-rose-400 flex items-center justify-center shadow-xl transition-all transform hover:scale-105"
                    title="Пропустить"
                  >
                    <X className="w-8 h-8" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenDetail(currentCard)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                  >
                    Подробнее
                  </button>

                  <button
                    type="button"
                    onClick={handleLike}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white flex items-center justify-center shadow-xl shadow-rose-600/30 transition-all transform hover:scale-105"
                    title="Лайкнуть"
                  >
                    <Heart className="w-8 h-8 fill-current" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">Все карточки просмотрены!</div>
          )}
        </div>

        {/* Right Column: Mutual Matches with Friends */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    src={selectedFriend.avatar}
                    alt={selectedFriend.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-700"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-slate-900"></span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Совпадения с: {selectedFriend.name}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Бюджет друга: до {selectedFriend.budget_max.toLocaleString()} ₽
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold">
                {mutualListings.length} Match
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Ниже квартиры, которые понравились и <strong>вам</strong>, и <strong>{selectedFriend.name}</strong>. Вы можете объединить бюджет и снять или купить их вместе!
            </p>

            {mutualListings.length > 0 ? (
              <div className="space-y-3">
                {mutualListings.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onOpenDetail(item)}
                    className="p-3 bg-slate-950/80 hover:bg-slate-950 border border-rose-500/30 hover:border-rose-500/60 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <img
                      src={item.photos[0]}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
                          Взаимный Match 🔥
                        </span>
                        <span className="text-xs font-bold text-white truncate">
                          {item.price_rub.toLocaleString()} ₽
                        </span>
                      </div>
                      <h4 className="text-xs text-slate-200 font-semibold truncate group-hover:text-rose-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        {item.address} • Школа {item.school_walk_minutes} мин
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors flex-shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-slate-500 space-y-2">
                <Users className="w-8 h-8 mx-auto opacity-30" />
                <p className="text-xs">
                  Пока нет взаимных совпадений. Лайкайте карточки слева — если вкусы совпадут с {selectedFriend.name}, квартира появится здесь!
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
