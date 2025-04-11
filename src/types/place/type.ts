export interface PlaceItemType {
  id: string;
  placeName: string;
  addressName?: string;
  roadAddressName?: string;
  phone?: string;
  categoryName?: string;
  placeUrl?: string;
  categoryGroupCode?: string;
  x?: string;
  y?: string;
  [key: string]: any;
}