import React, { useState } from 'react';
import { 
  X, User, UserPlus, Heart, Save, CheckCircle2, 
  AlertCircle, LogOut, Shield, MapPin, ExternalLink, Sparkles
} from 'lucide-react';
import { UserAccount, ListingItem, FriendProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUpdateUser: (updated: UserAccount) => void;
  likedListings: ListingItem[];
  onOpenListingModal: (listing: ListingItem) => void;
  onToggleLike: (listingId: number) => void;
  friendsList: FriendProfile[];
  onFriendAdded: (newFriends: FriendProfile[]) => void;
  allUsers: { username: string; display_name: string }[];
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  likedListings,
  onOpenListingModal,
  onToggleLike,
  friendsList,
  onFriendAdded,
  allUsers
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'likes' | 'friends' | 'register'>('profile');
  const [displayName, setDisplayName] = useState(currentUser.display_name);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [friendUsernameInput, setFriendUsernameInput] = useState('');
  const [friendError, setFriendError] = useState('');
  const [friendSuccess, setFriendSuccess] = useState('');
  const [isAddingFriend, setIsAddingFriend] = useState(false);

  // New user registration fields
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  if (!isOpen) return null;

  // Handle saving edited display name
  const handleSaveName = async () => {
    if (!displayName.trim()) return;
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          display_name: displayName.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onUpdateUser(data.user);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle adding friend by unique username
  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    setFriendError('');
    setFriendSuccess('');
    if (!friendUsernameInput.trim()) return;

    setIsAddingFriend(true);
    try {
      const res = await fetch('/api/user/friends/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          friendUsername: friendUsernameInput.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFriendError(data.error || 'Ошибка добавления друга');
      } else {
        setFriendSuccess(data.message || 'Друг успешно добавлен!');
        setFriendUsernameInput('');
        if (data.friends) {
          onFriendAdded(data.friends);
        }
      }
    } catch (err: any) {
      setFriendError('Сетевая ошибка при добавлении');
    } finally {
      setIsAddingFriend(false);
    }
  };

  // Handle new user quick registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!newUsername.trim() || !newPassword.trim() || !newDisplayName.trim()) {
      setRegError('Заполните имя пользователя, пароль и отображаемое имя.');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername.trim(),
          password: newPassword.trim(),
          display_name: newDisplayName.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRegError(data.error || 'Ошибка регистрации');
      } else {
        setRegSuccess(`Пользователь @${data.user.username} успешно зарегистрирован!`);
        onUpdateUser(data.user);
        setDisplayName(data.user.display_name);
        setTimeout(() => {
          setActiveTab('profile');
        }, 1200);
      }
    } catch (err: any) {
      setRegError('Ошибка связи с сервером');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.display_name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{currentUser.display_name}</h2>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-mono">
                  @{currentUser.username}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Управление личным профилем, лайками и списком друзей для совместного поиска
              </p>
            </div>
          </div>

          {/* Navigation Pills */}
          <div className="flex flex-wrap gap-1.5 mt-5">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Профиль & Имя
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'likes'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
              <span>Лайкнутые квартиры ({likedListings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'friends'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Друзья ({friendsList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'register'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              + Регистрация нового
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* TAB 1: Profile & Edit Display Name */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>Настройки профиля</span>
                </h3>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 block font-medium">
                    Имя пользователя (уникальный логин):
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`@${currentUser.username}`}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-400 font-mono cursor-not-allowed"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    По этому имени друзья могут находить вас в системе.
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-300 block font-medium">
                    Отображаемое имя (видно другим пользователям):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Например: Иван Иванов"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleSaveName}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Сохранить</span>
                    </button>
                  </div>
                </div>

                {saveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Имя успешно обновлено и будет отображаться другим пользователям!</span>
                  </div>
                )}
              </div>

              {/* Account details summary */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Лайков поставлено</span>
                  <span className="text-xl font-bold text-white mt-1 block">
                    {currentUser.liked_listing_ids.length} квартир
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Добавлено друзей</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block">
                    {currentUser.friends.length} чел.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Liked Listings */}
          {activeTab === 'likes' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Понравившиеся квартиры</h3>
              {likedListings.length === 0 ? (
                <div className="text-center py-10 bg-slate-950/40 rounded-2xl border border-slate-800/80 p-6 space-y-2">
                  <Heart className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">У вас пока нет лайкнутых квартир.</p>
                  <p className="text-[11px] text-slate-500">
                    Ставьте сердечко во вкладках «Поиск» или «Тиндер», и они сохранятся в вашем профиле!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {likedListings.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-4 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.photos[0]}
                          alt={item.title}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-white truncate">{item.title}</h4>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 truncate">
                            <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                            <span className="truncate">{item.address}</span>
                          </div>
                          <div className="text-xs font-bold text-emerald-400 mt-1">
                            {item.price_rub.toLocaleString()} ₽{item.deal_type === 'rent' ? '/мес' : ''}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenListingModal(item);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                        >
                          Подробнее
                        </button>
                        <button
                          onClick={() => onToggleLike(item.id)}
                          className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-rose-400 border border-slate-800 transition-colors"
                          title="Убрать из лайков"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Friends Management */}
          {activeTab === 'friends' && (
            <div className="space-y-6">
              {/* Add friend by username form */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  <span>Добавить друга по уникальному имени</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Введите @username друга (например: <code className="text-indigo-400">artem</code>, <code className="text-indigo-400">maria</code>, <code className="text-indigo-400">daniil</code>). Имена пользователей уникальны.
                </p>

                <form onSubmit={handleAddFriend} className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2 text-xs text-slate-500">@</span>
                    <input
                      type="text"
                      value={friendUsernameInput}
                      onChange={(e) => setFriendUsernameInput(e.target.value)}
                      placeholder="username друга"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAddingFriend}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md disabled:opacity-50"
                  >
                    {isAddingFriend ? 'Поиск...' : 'Добавить'}
                  </button>
                </form>

                {friendError && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{friendError}</span>
                  </div>
                )}

                {friendSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{friendSuccess}</span>
                  </div>
                )}
              </div>

              {/* Friends List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Ваши друзья в системе ({friendsList.length}):
                </h4>
                {friendsList.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Друзья пока не добавлены.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {friendsList.map((f) => {
                      // Check mutual likes
                      const mutualCount = f.likedListingIds.filter(id => currentUser.liked_listing_ids.includes(id)).length;

                      return (
                        <div key={f.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                          <img
                            src={f.avatar}
                            alt={f.name}
                            className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-700"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs text-white truncate">{f.name}</div>
                            <div className="text-[11px] font-mono text-indigo-400 truncate">@{f.username}</div>
                            {mutualCount > 0 ? (
                              <span className="inline-block mt-1 text-[10px] text-rose-300 font-semibold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                                🔥 {mutualCount} взаимных совпадений
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 block mt-0.5">
                                Лайков: {f.likedListingIds.length}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Quick Registration */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-indigo-400" />
                    <span>Регистрация нового пользователя</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Создайте профиль с уникальным именем пользователя.
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Имя пользователя (уникальный username):
                    </label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="например: timur24"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Отображаемое имя (для других пользователей):
                    </label>
                    <input
                      type="text"
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      placeholder="например: Тимур Матвеев"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Пароль:
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {regError && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs">
                      {regError}
                    </div>
                  )}

                  {regSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs">
                      {regSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md transition-all mt-2"
                  >
                    Зарегистрировать и войти
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
