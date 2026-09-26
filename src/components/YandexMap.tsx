import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Compass, Layers, AlertCircle } from 'lucide-react';
import { ListingItem } from '../types';

declare global {
  interface Window {
    ymaps?: any;
  }
}

interface YandexMapProps {
  listings: ListingItem[];
  selectedListing: ListingItem | null;
  onSelectListing: (listing: ListingItem) => void;
  center?: [number, number];
  zoom?: number;
}

export const YandexMap: React.FC<YandexMapProps> = ({
  listings,
  selectedListing,
  onSelectListing,
  center = [56.035, 92.88], // Красноярск центр
  zoom = 12,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const placemarksRef = useRef<Map<number, any>>(new Map());
  const [ymapsLoaded, setYmapsLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Check if ymaps script is ready
  useEffect(() => {
    let checkInterval: any = null;
    let attempts = 0;

    const checkYmaps = () => {
      attempts++;
      if (window.ymaps && window.ymaps.ready) {
        window.ymaps.ready(() => {
          setYmapsLoaded(true);
        });
        if (checkInterval) clearInterval(checkInterval);
      } else if (attempts > 30) {
        if (checkInterval) clearInterval(checkInterval);
        setMapError('Не удалось загрузить Яндекс Карты. Работает автономный георежим.');
      }
    };

    checkYmaps();
    if (!window.ymaps) {
      checkInterval = setInterval(checkYmaps, 300);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!ymapsLoaded || !mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const map = new window.ymaps.Map(
        mapContainerRef.current,
        {
          center: center,
          zoom: zoom,
          controls: ['zoomControl', 'fullscreenControl', 'typeSelector', 'geolocationControl'],
        },
        {
          searchControlProvider: 'yandex#search',
        }
      );

      mapInstanceRef.current = map;
    } catch (e: any) {
      console.error('Failed to init Yandex Map:', e);
      setMapError('Ошибка инициализации карты');
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, [ymapsLoaded]);

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

      // Custom HTML balloon content
      const balloonContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 6px; max-width: 250px; color: #0f172a;">
          <img src="${item.photos[0]}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
          <div style="font-size: 14px; font-weight: 800; color: #1e1b4b; margin-bottom: 2px;">${priceFormatted}</div>
          <div style="font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 4px;">${item.title}</div>
          <div style="font-size: 11px; color: #047857; font-weight: 600; margin-bottom: 4px;">🏫 ${item.nearest_school} (${item.school_walk_minutes} мин)</div>
          <div style="font-size: 10px; color: #64748b;">📍 ${item.address}</div>
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
  }, [listings, ymapsLoaded]);

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
    <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
      
      {/* Top Map Status Banner */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-xs shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-semibold text-white">Яндекс.Карты API</span>
        <span className="text-slate-400">({listings.length} меток на карте Красноярска)</span>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Fallback View if Yandex Maps script fails to load */}
      {!ymapsLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/90 text-center">
          {mapError ? (
            <div className="space-y-3 max-w-md">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="text-sm text-slate-300">{mapError}</p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                Координаты {listings.length} квартир по Красноярску зафиксированы. Вы можете просматривать их в списке с точными адресами.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400">Подключение Яндекс Карт v2.1 и геокодирование объектов...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
