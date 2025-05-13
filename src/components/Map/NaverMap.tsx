// src/components/Map/NaverMap.tsx
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { initializeMap, registerMapClickClose } from './utils/mapInitializer';
import { createMarkersOnMap } from './utils/markerCreator';
import { NaverMapProps } from "../../types/map/type.ts";
import ResearchButton from "./interface/ResearchButton.tsx";
import MoveToMyLocationButton from "./interface/MoveToMyLocationButton.tsx";
import { renderKakaoRouteOnNaverMap } from "./utils/renderKakaoRoute.ts";
import {clearRouteErrorMessage, clearRouteInfo, setRouteInfo} from "../../store/slices/searchSlice.ts";

declare global {
  interface Window {
    naver: any;
  }
}

export default function NaverMap({ markers }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRefs = useRef<any[]>([]);
  const prevMarkersRef = useRef<typeof markers>([]);
  const infoWindowRef = useRef<any>(null);
  const selectedMarkerRef = useRef<any>(null);
  const routeLineRef = useRef<naver.maps.Polyline | null>(null);
  const selectedPlaceId = useSelector((state: RootState) => state.search.selectedPlaceId);
  const { origin, destination } = useSelector((state: RootState) => state.search.selectedPlacePair);
  const currentPage = useSelector((state: RootState) => state.search.currentPage);
  const dispatch = useDispatch();
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

    // 중심을 살짝 아래쪽으로 조정 (위도를 감소시키면 화면상 더 위쪽으로 올라가게 됨)
    // const adjustedPosition = new window.naver.maps.LatLng(markers[markerIndex].lat + 0.002, markers[markerIndex].lng);
    // setTimeout(() => {
    //   console.log(adjustedPosition, markers[markerIndex].lat, markers[markerIndex].lng);
    //   mapInstanceRef.current.setCenter(adjustedPosition);
    // }, 0);
  }, [selectedPlaceId]);

  // Initialize map once
  useEffect(() => {
    if (window.naver && window.naver.maps) {
      initializeMap(mapRef, mapInstanceRef);
      setTimeout(() => {
        registerMapClickClose(mapInstanceRef, infoWindowRef, selectedMarkerRef);
      }, 0);
    } else {
      const script = document.createElement('script');
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_CLIENT_ID}`;
      script.async = true;
      script.onload = () => {
        window.naver.maps.onJSContentLoaded = () => {
          initializeMap(mapRef, mapInstanceRef);
          setTimeout(() => {
            registerMapClickClose(mapInstanceRef, infoWindowRef, selectedMarkerRef);
          }, 0);
        };
      };
      document.head.appendChild(script);
    }
  }, []);

  // Render markers when markers data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver) return;
    const prev = prevMarkersRef.current;

    const isSameMarkers =
      prev.length === markers.length &&
      prev.every((prevMarker, i) => {
        const next = markers[i];
        return (
          prevMarker.id === next.id &&
          prevMarker.lat === next.lat &&
          prevMarker.lng === next.lng
        );
      });
    // Clear old markers
    markerRefs.current.forEach((m) => m.setMap(null));

    // Create and store new markers
    markerRefs.current = createMarkersOnMap({
      map: mapInstanceRef.current,
      markers,
      infoWindowRef,
      selectedMarkerRef,
      dispatch,
      origin,
      destination
    });

    // Fit bounds to new markers
    if (markers.length > 0 && !isSameMarkers) {
      const bounds = new window.naver.maps.LatLngBounds();
      markers.forEach(({ lat, lng }) => {
        bounds.extend(new window.naver.maps.LatLng(lat, lng));
      });
      mapInstanceRef.current.fitBounds(bounds);
    }
    prevMarkersRef.current = markers;
  }, [markers, origin, destination]);

  useEffect(() => {
    if (routeLineRef.current) {
      routeLineRef.current.setMap(null);
      routeLineRef.current = null;
    }

    const updateRoute = async () => {
      // 기존 선 제거
      if (origin && destination && mapInstanceRef.current) {
        dispatch(clearRouteInfo())
        dispatch(clearRouteErrorMessage())
        const result = await renderKakaoRouteOnNaverMap(
          mapInstanceRef.current,
          { lat: origin.lat, lng: origin.lng },
          { lat: destination.lat, lng: destination.lng },
          dispatch
        );
        if (result?.polyline) {
          routeLineRef.current = result.polyline;
        }
        if (result?.duration && result?.distance) {
          dispatch(setRouteInfo({
            duration: result.duration,
            distance: result.distance,
          }));
        }
      }
    };

    updateRoute();
  }, [origin, destination]);

  return <div className="relative w-full h-full">
    <div ref={mapRef} className="w-full h-full" />

    {/* 하단 버튼 */}
    <ResearchButton
      mapInstance={mapInstanceRef.current}
    />

    <MoveToMyLocationButton mapInstance={mapInstanceRef.current} />
  </div>
}
