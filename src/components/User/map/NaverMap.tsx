import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { initializeMap, registerMapClickClose } from '../../Map/utils/mapInitializer.ts';
import { createMarkersOnMap } from '../../Map/utils/markerCreator.ts';
import { NaverMapProps } from "../../../types/map/type.ts";
import { renderKakaoRouteOnNaverMap } from "../../Map/utils/renderKakaoRoute.ts";
import { clearRouteErrorMessage, clearRouteInfo, setRouteInfo } from "../../../store/slices/searchSlice.ts";

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

  useEffect(() => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }
  }, [currentPage]);

  useEffect(() => {
    if (!selectedPlaceId || !mapInstanceRef.current || markerRefs.current.length === 0) return;
    const markerIndex = markers.findIndex((m) => m.id === selectedPlaceId);
    if (markerIndex === -1) return;
    const marker = markerRefs.current[markerIndex];
    const position = new window.naver.maps.LatLng(markers[markerIndex].lat, markers[markerIndex].lng);
    if (!marker) return;
    window.naver.maps.Event.trigger(marker, 'click');

  }, [selectedPlaceId]);

  useEffect(() => {
    let isMapInitialized = false;

    const initMapAndMarkers = () => {
      initializeMap(mapRef, mapInstanceRef);
      registerMapClickClose(mapInstanceRef, infoWindowRef, selectedMarkerRef);
      isMapInitialized = true;

      if (markers.length > 0) {
        renderMarkers();
      }
    };

    if (window.naver && window.naver.maps) {
      setTimeout(() => {
        initMapAndMarkers();
      }, 0);
    } else {
      const script = document.createElement('script');
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_CLIENT_ID}`;
      script.async = true;
      script.onload = () => {
        window.naver.maps.onJSContentLoaded = () => {
          setTimeout(() => {
            initMapAndMarkers();
          }, 0);
        };
      };
      document.head.appendChild(script);
    }
  }, []);

  const renderMarkers = () => {
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

    markerRefs.current.forEach((m) => m.setMap(null));

    markerRefs.current = createMarkersOnMap({
      map: mapInstanceRef.current,
      markers,
      infoWindowRef,
      selectedMarkerRef,
      dispatch,
      origin,
      destination
    });

    if (markers.length > 0 && !isSameMarkers) {
      const bounds = new window.naver.maps.LatLngBounds();
      markers.forEach(({ lat, lng }) => {
        bounds.extend(new window.naver.maps.LatLng(lat, lng));
      });
      mapInstanceRef.current.fitBounds(bounds);
    }
    prevMarkersRef.current = markers;
  };

  useEffect(() => {
    if (mapInstanceRef.current && window.naver) {
      renderMarkers();
    }
  }, [markers, origin, destination]);

  useEffect(() => {
    if (routeLineRef.current) {
      routeLineRef.current.setMap(null);
      routeLineRef.current = null;
    }

    const updateRoute = async () => {
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

  </div>
}
