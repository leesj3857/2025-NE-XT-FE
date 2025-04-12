// src/components/Map/NaverMap.tsx
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { initializeMap, registerMapClickClose } from './utils/mapInitializer';
import { createMarkersOnMap } from './utils/markerCreator';
import { NaverMapProps } from "../../types/map/type.ts";
import { useNavigate, useLocation } from 'react-router-dom';
import ResearchButton from "./interface/ResearchButton.tsx";
import MoveToMyLocationButton from "./interface/MoveToMyLocationButton.tsx";

declare global {
  interface Window {
    naver: any;
  }
}

export default function NaverMap({ markers }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRefs = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const selectedMarkerRef = useRef<any>(null);
  const selectedPlaceId = useSelector((state: RootState) => state.search.selectedPlaceId);
  const currentPage = useSelector((state: RootState) => state.search.currentPage);
  const navigate = useNavigate();
  const location = useLocation();

  // Close InfoWindow when page changes
  useEffect(() => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }
  }, [currentPage]);

  // Trigger marker click when selectedPlaceId changes
  useEffect(() => {
    if (!selectedPlaceId || !mapInstanceRef.current || markerRefs.current.length === 0) return;
    const markerIndex = markers.findIndex((m) => m.id === selectedPlaceId);
    if (markerIndex === -1) return;
    const marker = markerRefs.current[markerIndex];
    const position = new window.naver.maps.LatLng(markers[markerIndex].lat, markers[markerIndex].lng);
    if (!marker) return;
    window.naver.maps.Event.trigger(marker, 'click');
    setTimeout(() => {
      mapInstanceRef.current.setCenter(position);
    }, 0);
  }, [selectedPlaceId]);

  // Initialize map once
  useEffect(() => {
    if (window.naver && window.naver.maps) {
      initializeMap(mapRef, mapInstanceRef);
      registerMapClickClose(mapInstanceRef, infoWindowRef, selectedMarkerRef);
    } else {
      const script = document.createElement('script');
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_CLIENT_ID}`;
      script.async = true;
      script.onload = () => {
        window.naver.maps.onJSContentLoaded = () => {
          initializeMap(mapRef, mapInstanceRef);
          registerMapClickClose(mapInstanceRef, infoWindowRef, selectedMarkerRef);
        };
      };
      document.head.appendChild(script);
    }
  }, []);

  // Render markers when markers data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver) return;

    // Clear old markers
    markerRefs.current.forEach((m) => m.setMap(null));

    // Create and store new markers
    markerRefs.current = createMarkersOnMap({
      map: mapInstanceRef.current,
      markers,
      infoWindowRef,
      selectedMarkerRef,
    });

    // Fit bounds to new markers
    if (markers.length > 0) {
      const bounds = new window.naver.maps.LatLngBounds();
      markers.forEach(({ lat, lng }) => {
        bounds.extend(new window.naver.maps.LatLng(lat, lng));
      });
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [markers]);

  return <div className="relative w-full h-full">
    <div ref={mapRef} className="w-full h-full" />

    {/* 하단 버튼 */}
    <ResearchButton
      mapInstance={mapInstanceRef.current}
    />

    <MoveToMyLocationButton mapInstance={mapInstanceRef.current} />
  </div>
}
