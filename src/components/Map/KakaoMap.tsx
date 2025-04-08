import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface MarkerType {
  lat: number;
  lng: number;
  title: string;
}

interface KakaoMapProps {
  markers: MarkerType[];
}

export default function KakaoMap({ markers }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadKakaoMap = () => {
      if (!window.kakao || !mapRef.current) return;

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 3,
      });

      markers.forEach(({ lat, lng, title }) => {
        const markerPosition = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({
          map,
          position: markerPosition,
          title,
        });
      });

      if (markers.length > 0) {
        map.setCenter(new window.kakao.maps.LatLng(markers[0].lat, markers[0].lng));
      }
    };

    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JS_KEY}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => {
        window.kakao.maps.load(() => {
          loadKakaoMap();
        });
      };
    } else {
      loadKakaoMap();
    }
  }, [markers]);

  return <div ref={mapRef} className="w-full h-full" />;
}
