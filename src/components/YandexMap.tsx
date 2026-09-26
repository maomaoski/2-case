import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { ListingItem } from '../types';

declare global {
  interface Window {
    ymaps?: any;
    __openMapListingDetail?: any;
  }
}

interface YandexMapProps {
  listings: ListingItem[];
  selectedListing: ListingItem | null;
  onSelectListing: (listing: ListingItem) => void;
  onOpenModal?: (listing: ListingItem) => void;
  center?: [number, number];
  zoom?: number;
  city?: string;
}

export const YandexMap: React.FC<YandexMapProps> = ({
  listings,
  selectedListing,
  onSelectListing,
  onOpenModal,
  center = [56.035, 92.88],
  zoom = 12,
  city = 'Красноярск',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const placemarksRef = useRef<Map<number, any>>(new Map());
  const [ymapsLoaded, setYmapsLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Expose global callback for Yandex Map HTML balloon buttons
  useEffect(() => {
    (window as any).__openMapListingDetail = (id: number) => {
      const target = listings.find((l) => l.id === id);
      if (target) {
        onSelectListing(target);
        if (onOpenModal) {
          onOpenModal(target);
        }
      }
    };
    return () => {
      delete (window as any).__openMapListingDetail;
    };
  }, [listings, onSelectListing, onOpenModal]);

  // Load Yandex Maps API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.ymaps) {
      window.ymaps.ready(() => {
        setYmapsLoaded(true);
      });
      return;
    }

    const checkYmaps = setInterval(() => {
      if (window.ymaps) {
        clearInterval(checkYmaps);
        window.ymaps.ready(() => {
          setYmapsLoaded(true);
        });
      }
    }, 200);

    const timeout = setTimeout(() => {
      clearInterval(checkYmaps);
      if (!window.ymaps) {
        setMapError('Не удалось загрузить Яндекс.Карты. Проверьте интернет-соединение.');
      }
    }, 5000);

    return () => {
      clearInterval(checkYmaps);
      clearTimeout(timeout);
    };
  }, []);

  // Initialize Map Instance
  useEffect(() => {
    if (!ymapsLoaded || !mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const map = new window.ymaps.Map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        controls: ['zoomControl', 'fullscreenControl', 'typeSelector', 'geolocationControl'],
      });

      mapInstanceRef.current = map;
    } catch (err: any) {
      console.error('Yandex Maps init error:', err);
      setMapError('Ошибка инициализации карты');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [ymapsLoaded]);

  // Update center/zoom when props change
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setCenter(center, zoom, { duration: 300 });
    }
  }, [center?.[0], center?.[1], zoom]);

  // Update Placemarks when listings change
  useEffect(() => {
    if (!ymapsLoaded || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    
    // Clear old placemarks
    placemarksRef.current.forEach((pm) => {
      map.geoObjects.remove(pm);
    });
    placemarksRef.current.clear();

    const bounds: number[][] = [];

    listings.forEach((item) => {
      if (!item.latitude || !item.longitude) return;

      bounds.push([item.latitude, item.longitude]);

      const isSelected = selectedListing?.id === item.id;
      const priceFormatted = `${item.price_rub.toLocaleString()} ₽${item.deal_type === 'rent' ? '/мес' : ''}`;

      // Custom HTML balloon content with interactive "Подробнее" button
      const balloonContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 6px; max-width: 250px; color: #0f172a;">
          <img src="${item.photos[0]}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
          <div style="font-size: 14px; font-weight: 800; color: #1e1b4b; margin-bottom: 2px;">${priceFormatted}</div>
          <div style="font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 3px;">${item.title}</div>
          <div style="font-size: 10px; color: #64748b; margin-bottom: 8px;">📍 ${item.address}</div>
          <button 
            type="button"
            onclick="window.__openMapListingDetail(${item.id})"
            style="width: 100%; padding: 7px 12px; background: #4f46e5; color: #ffffff; border: none; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; text-align: center; transition: background 0.2s;"
            onmouseover="this.style.background='#4338ca'"
            onmouseout="this.style.background='#4f46e5'"
          >
            Подробнее о квартире →
          </button>
        </div>
      `;

      const placemark = new window.ymaps.Placemark(
        [item.latitude, item.longitude],
        {
          balloonContent: balloonContent,
          hintContent: `${item.title} — ${priceFormatted}`,
          iconCaption: `${priceFormatted}`,
        },
        {
          preset: isSelected ? 'islands#redDotIconWithCaption' : 'islands#violetDotIconWithCaption',
          iconColor: isSelected ? '#ef4444' : '#6366f1',
        }
      );

      placemark.events.add('click', () => {
        onSelectListing(item);
      });

      map.geoObjects.add(placemark);
      placemarksRef.current.set(item.id, placemark);
    });

    // Auto-fit map to show all placemarks
    if (bounds.length > 1) {
      map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 40 });
    } else if (bounds.length === 1) {
      map.setCenter(bounds[0], 14, { duration: 300 });
    }
  }, [listings, ymapsLoaded, selectedListing]);

  // Center on selected listing
  useEffect(() => {
    if (!ymapsLoaded || !mapInstanceRef.current || !selectedListing) return;

    const map = mapInstanceRef.current;
    if (selectedListing.latitude && selectedListing.longitude) {
      map.setCenter([selectedListing.latitude, selectedListing.longitude], 15, {
        duration: 400,
      });

      const pm = placemarksRef.current.get(selectedListing.id);
      if (pm && pm.balloon) {
        pm.balloon.open();
      }
    }
  }, [selectedListing, ymapsLoaded]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
      {/* Top Map Status Overlay */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-xs shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-semibold text-white">Яндекс.Карты API</span>
        <span className="text-slate-400">({listings.length} меток в г. {city})</span>
      </div>

      {/* Map Canvas */}
      <div className="h-[420px] sm:h-[480px] w-full bg-slate-950 flex items-center justify-center">
        {mapError ? (
          <div className="p-6 text-center space-y-3 max-w-md">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="text-sm text-slate-300">{mapError}</p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              Координаты {listings.length} квартир по г. {city} зафиксированы. Вы можете просматривать их в списке с точными адресами.
            </div>
          </div>
        ) : (
          <div ref={mapContainerRef} className="w-full h-full" />
        )}
      </div>
    </div>
  );
};
