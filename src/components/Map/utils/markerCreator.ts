import { CreateMarkersProps } from "../../../types/map/type.ts";
import { InfoWindowInterface } from "../interface/InfoWindowInterface.tsx";
import {setSelectedPlaceId, setOriginPlace, setDestinationPlace, setSelectedDetailedPlace} from "../../../store/slices/searchSlice.ts";
import convertMarkerToPlaceItem from "./convertMarkerTypeToPlaceItemType.ts";

export const createMarkersOnMap = ({
                                     map,
                                     markers,
                                     infoWindowRef,
                                     selectedMarkerRef,
                                     dispatch,
                                     origin,
                                     destination
                                   }: CreateMarkersProps ) => {
  return markers.map((markerProp) => {

    const {
      id,
      lat,
      lng,
      title,
      address,
      roadAddress,
      phone,
      category,
      placeUrl,
      categoryGroupCode,
    } = markerProp;

    let icon: string | undefined = undefined;

    if (id === origin?.id) {
      icon = '/greenmarker.webp';
    } else if (id === destination?.id) {
      icon = '/redmarker.webp';
    }

    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lng),
      map,
      title,
      icon,
      clickable: true,
    });

    const contentHtml = InfoWindowInterface({ ...markerProp });

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

    setTimeout(() => {
      const container = infoWindow.getContentElement?.();
      if (!container) return;

      container.querySelectorAll("button[data-type]").forEach((btn:Element) => {
        btn.addEventListener("click", () => {
          const type = (btn as HTMLElement).getAttribute("data-type");

          if (type === "origin") {
            dispatch(setOriginPlace({
              id, placeName: title, roadAddressName: roadAddress,
              addressName: address, phone, categoryName: category,
              placeUrl, categoryGroupCode, lat, lng
            }));
          } else if (type === "destination") {
            dispatch(setDestinationPlace({
              id, placeName: title, roadAddressName: roadAddress,
              addressName: address, phone, categoryName: category,
              placeUrl, categoryGroupCode, lat, lng
            }));
          } else if (type === "details") {
            const detailedPlace = convertMarkerToPlaceItem(markerProp);
            dispatch(setSelectedDetailedPlace(detailedPlace));
          }

          // infoWindow.close(); // 버튼 누르면 닫기
        });
      });
    }, 0);
    return marker;
  });
};
