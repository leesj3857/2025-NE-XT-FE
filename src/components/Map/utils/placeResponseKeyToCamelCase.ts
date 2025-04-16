import { PlaceItemType } from "../../../types/place/type.ts";

export const toCamelCase = (place: any): PlaceItemType => ({
  id: place.id,
  placeName: place.place_name,
  addressName: place.address_name,
  roadAddressName: place.road_address_name,
  roadAddressNameEN: place.roadAddressNameEN,
  phone: place.phone,
  categoryName: place.category_name,
  categoryNameEN: place.categoryNameEN,
  placeUrl: place.place_url,
  categoryGroupCode: place.category_group_code,
  x: place.x,
  y: place.y,
});