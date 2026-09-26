import React, { useState, useEffect } from 'react';
import { 
  Flame, Heart, X, Sparkles, Users, 
  MapPin, CheckCircle2, RotateCcw, ExternalLink, ArrowRight, UserPlus
} from 'lucide-react';
import { ListingItem, FriendProfile } from '../types';

interface TinderTabProps {
  listings: ListingItem[];
  userLikedIds: number[];
  onToggleLike: (listingId: number) => void;
  onOpenDetail: (listing: ListingItem) => void;
  city: string;
  friends: FriendProfile[];
  onOpenProfile?: () => void;
}

export const TinderTab: React.FC<TinderTabProps> = ({
  listings,
  userLikedIds,
  onToggleLike,
  onOpenDetail,
  city,
  friends,
  onOpenProfile
}) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string>(friends[0]?.id || 'friend-artem');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [activeAiFilter, setActiveAiFilter] = useState<string>('');
  const [deck, setDeck] = useState<ListingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<'liked' | 'passed' | null>(null);

  // Initialize and filter deck based on city and optional AI prompt
  useEffect(() => {
    let pool = listings.filter((l) => l.city.toLowerCase() === city.toLowerCase());

    if (activeAiFilter.trim()) {
      const lower = activeAiFilter.toLowerCase();
      const isRent = /снять|аренд/i.test(lower);
      const isBuy = /купить|ипотек/i.test(lower);

      pool = pool.filter((l) => {
        if (isRent && l.deal_type !== 'rent') return false;
        if (isBuy && l.deal_type !== 'buy') return false;
        return true;
      });

      if (pool.length === 0) {
        pool = listings.filter((l) => l.city.toLowerCase() === city.toLowerCase());
      }
    }

    // Shuffle randomly as requested: "в случайном порядке выходили квартиры подходящие по запросу"
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setDeck(shuffled);
    setCurrentIndex(0);
  }, [city, activeAiFilter, listings]);

  const selectedFriend = friends.find((f) => f.id === selectedFriendId) || friends[0];
  const currentCard = deck.length > 0 ? deck[currentIndex % deck.length] : null;

  const handleLike = () => {
    if (!currentCard) return;
    onToggleLike(currentCard.id);
    setLastAction('liked');
    setTimeout(() => {
      setLastAction(null);
      setCurrentIndex((prev) => (prev + 1) % (deck.length || 1));
    }, 300);
  };

  const handlePass = () => {
    setLastAction('passed');
    setTimeout(() => {
      setLastAction(null);
      setCurrentIndex((prev) => (prev + 1) % (deck.length || 1));
    }, 250);
  };

  const handleApplyAiQuery = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveAiFilter(aiPrompt.trim());
  };

  const handleResetAiQuery = () => {
    setAiPrompt('');
    setActiveAiFilter('');
  };

  // Mutual matches with selected friend
  const mutualListings = listings.filter(
    (l) => userLikedIds.includes(l.id) && selectedFriend?.likedListingIds.includes(l.id)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900/40 via-purple-900/30 to-indigo-900/40 border border-rose-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold mb-2">
            <Flame className="w-4 h-4 fill-current text-rose-500" />
            <span>Тиндер квартир & Совместный подбор с друзьями</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Квартирный Match: {city}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Свайпайте квартиры в случайном порядке. Если вы и ваш друг лайкнете один вариант — образуется совместный Match!
          </p>
        </div>

        {/* Selected Friend Picker & Add Friend */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">С кем ищем:</span>
          <div className="flex flex-wrap items-center gap-2">
            {friends.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFriendId(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  selectedFriendId === f.id
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-2 ring-rose-500/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <img src={f.avatar} alt={f.name} className="w-5 h-5 rounded-full object-cover" />
                <span>{f.name}</span>
              </button>
            ))}

            {onOpenProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                title="Добавить друга по уникальному имени пользователя"
              >
                <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
                <span>+ Друг</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI PROMPT INPUT FOR TINDER: "добавь возможность также написать запрос в ии, чтоб пользователь сказал свой запрос к квартире, и ему в случайном порядке выходили квартиры подходящие по запросу" */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white">
              ИИ-запрос для Тиндера (случайная выдача подходящих вариантов)
            </h3>
          </div>

          {activeAiFilter && (
            <button
              onClick={handleResetAiQuery}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Показывать все из г. {city}</span>
            </button>
          )}
        </div>

        <form onSubmit={handleApplyAiQuery} className="flex gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Например: хочу снять светлую двухкомнатную квартиру или только покупка..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
          <button
            type="submit"
            className="px-4 sm:px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Применить</span>
          </button>
        </form>

        {activeAiFilter && (
          <div className="text-[11px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl flex items-center justify-between">
            <span>Активный фильтр ИИ: «{activeAiFilter}» • Найдено в случайном порядке: {deck.length} вариантов</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
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
                    {currentCard.source_name || 'Авито'} • {currentCard.city}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-indigo-600/90 text-white font-bold text-xs">
                    {currentCard.deal_type === 'rent' ? 'Аренда' : 'Покупка'}
                  </span>
                </div>

                {/* Friend interest tag */}
                {selectedFriend?.likedListingIds.includes(currentCard.id) && (
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

                {/* Swipe Feedback Overlay */}
                {lastAction === 'liked' && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center animate-in zoom-in-50 duration-200">
                    <div className="p-4 rounded-full bg-emerald-500 text-white shadow-2xl">
                      <Heart className="w-16 h-16 fill-current" />
                    </div>
                  </div>
                )}
                {lastAction === 'passed' && (
                  <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center animate-in zoom-in-50 duration-200">
                    <div className="p-4 rounded-full bg-rose-500 text-white shadow-2xl">
                      <X className="w-16 h-16" />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Pass & Like */}
              <div className="p-5 flex items-center justify-center gap-6 bg-slate-950/80 border-t border-slate-800">
                <button
                  onClick={handlePass}
                  className="w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                  title="Пропустить"
                >
                  <X className="w-6 h-6" />
                </button>

                <button
                  onClick={() => onOpenDetail(currentCard)}
                  className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition-all"
                >
                  Подробнее
                </button>

                <button
                  onClick={handleLike}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition-transform hover:scale-105 active:scale-95"
                  title="Лайкнуть"
                >
                  <Heart className="w-6 h-6 fill-current" />
                </button>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <Flame className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">В г. {city} варианты закончились</h3>
              <p className="text-xs text-slate-400">Смените город сверху или сбросьте фильтр ИИ.</p>
              <button
                onClick={handleResetAiQuery}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Показать снова
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Co-living Matches with Selected Friend */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white">
                  Совпадения с {selectedFriend?.name || 'другом'}
                </h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {mutualListings.length} Match
              </span>
            </div>

            {mutualListings.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <p>Пока нет взаимных лайков с {selectedFriend?.name}.</p>
                <p className="text-[11px] text-slate-500">
                  Лайкайте варианты слева — когда вкусы совпадут, здесь появится уведомление!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {mutualListings.map((match) => (
                  <div
                    key={match.id}
                    className="p-3 rounded-2xl bg-slate-950/80 border border-rose-500/30 flex items-center justify-between gap-3 shadow-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={match.photos[0]}
                        alt={match.title}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-rose-400 block uppercase">
                          🔥 Взаимный интерес
                        </span>
                        <h4 className="font-bold text-xs text-white truncate">{match.title}</h4>
                        <div className="text-xs font-bold text-emerald-400">
                          {match.price_rub.toLocaleString()} ₽{match.deal_type === 'rent' ? '/мес' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => onOpenDetail(match)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        Подробнее
                      </button>
                      <a
                        href={match.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] text-center border border-slate-700 flex items-center justify-center gap-1"
                      >
                        <span>{match.source_name || 'Авито'}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
