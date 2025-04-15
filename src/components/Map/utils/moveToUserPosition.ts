// src/components/Map/utils/moveToUserPosition.ts
export const moveToUserPosition = (
  mapInstance: any,
  onError?: (error: GeolocationPositionError) => void
) => {
  if (!navigator.geolocation || !mapInstance) return;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const newCenter = new window.naver.maps.LatLng(latitude, longitude);
      mapInstance.setCenter(newCenter);
    },
    (error) => {
      console.error('위치 정보를 가져오지 못했습니다:', error);
      if (onError) onError(error);
      else alert('Failed to get location information.');
    }
  );
};
