import {PlaceItemType} from "../../../types/place/type.ts";
import {MarkerType} from "../../../types/map/type.ts";

export default function convertMarkerToPlaceItem (marker: MarkerType): PlaceItemType {
  return {
    id: marker.id,
    placeName: marker.title,
    addressName: marker.address,
    roadAddressName: marker.roadAddress,
    roadAddressNameEN: marker.roadAddressEN,
    phone: marker.phone,
    categoryName: marker.category,
    categoryNameEN: marker.categoryEN,
    placeUrl: marker.placeUrl,
    categoryGroupCode: marker.categoryGroupCode,
    lat: marker.lat,
    lng: marker.lng,
    x: marker.lng?.toString(), // 문자열 변환
    y: marker.lat?.toString(),
  };
};