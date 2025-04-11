// 지도 초기화 함수
export const initializeMap = (mapRef: React.RefObject<HTMLDivElement | null>, mapInstanceRef: React.RefObject<any>) => {
  if (!mapRef.current || mapInstanceRef.current) return;

  const map = new window.naver.maps.Map(mapRef.current, {
    center: new window.naver.maps.LatLng(37.5665, 126.9780),
    zoom: 10,
    scaleControl: false,
    mapTypeControl: false,
    zoomControl: false,
    mapDataControl: false,
    logoControl: true,
    logoControlOptions: {
      position: window.naver.maps.Position.TOP_RIGHT,
    },
  });

  mapInstanceRef.current = map;
};

// 지도 클릭 시 InfoWindow 및 애니메이션 닫기
export const registerMapClickClose = (mapInstanceRef: React.RefObject<any>, infoWindowRef: React.RefObject<any>, selectedMarkerRef: React.RefObject<any>) => {
  const map = mapInstanceRef.current;
  if (!map) return;

  window.naver.maps.Event.addListener(map, 'click', () => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setAnimation(null);
      selectedMarkerRef.current = null;
    }
  });
};
