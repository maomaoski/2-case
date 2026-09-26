import React from 'react';
import { Bell, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { ListingItem } from '../types';

export interface PushToastData {
  id: string;
  title: string;
  body: string;
  listing?: ListingItem;
  type?: 'status' | 'recommendation';
}

interface PushNotificationToastProps {
  toast: PushToastData | null;
  onClose: () => void;
  onOpenListing?: (listing: ListingItem) => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  toast,
  onClose,
  onOpenListing,
}) => {
  if (!toast) return null;

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md border border-indigo-500/40 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                GeoRent Push
              </span>
              <span className="text-[10px] text-slate-500">• Только что</span>
            </div>
            <h4 className="text-xs font-bold text-white leading-snug">{toast.title}</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">{toast.body}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {toast.listing && onOpenListing && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-400">
            {toast.listing.price_rub.toLocaleString()} ₽{toast.listing.deal_type === 'rent' ? '/мес' : ''}
          </span>
          <button
            onClick={() => {
              onOpenListing(toast.listing!);
              onClose();
            }}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Открыть карточку</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
