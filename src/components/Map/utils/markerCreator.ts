import { CreateMarkersProps } from "../../../types/map/type.ts";
import { InfoWindowInterface } from "../interface/InfoWindowInterface.tsx";
import {setSelectedPlaceId} from "../../../store/slices/searchSlice.ts";

export const createMarkersOnMap = ({
                                     map,
                                     markers,
                                     infoWindowRef,
                                     selectedMarkerRef,
                                     dispatch
                                   }: CreateMarkersProps) => {
  return markers.map(({ id, lat, lng, title, address, roadAddress, phone, category, placeUrl }) => {
    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lng),
      map,
      title,
      clickable: true,
    });

    const contentHtml = InfoWindowInterface({
      title,
      category,
      roadAddress,
      address,
      phone,
      placeUrl,
    });

    const infoWindow = new window.naver.maps.InfoWindow({
      content: contentHtml,
      backgroundColor: "#fff",
      borderColor: "#ccc",
      borderWidth: 1,
      disableAnchor: false,
      anchorSize: new window.naver.maps.Size(10, 10),
    });

    window.naver.maps.Event.addListener(marker, 'click', () => {
      if (infoWindowRef.current) infoWindowRef.current.close();
      if (selectedMarkerRef.current) selectedMarkerRef.current.setAnimation(null);
      dispatch(setSelectedPlaceId(id));
      marker.setAnimation(window.naver.maps.Animation.BOUNCE);
      infoWindow.open(map, marker);
      infoWindowRef.current = infoWindow;
      selectedMarkerRef.current = marker;
      const targetEl = document.getElementById(`place-item-${id}`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setTimeout(() => marker.setAnimation(null), 700);
    });

    return marker;
  });
};
