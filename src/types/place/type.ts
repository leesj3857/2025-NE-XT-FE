export interface PlaceItemType {
  id: string;
  placeName: string;
  addressName?: string;
  roadAddressName?: string;
  roadAddressNameEN?: string;
  phone?: string;
  categoryName?: string;
  categoryNameEN?: string;
  placeUrl?: string;
  categoryGroupCode?: string;
  x?: string;
  y?: string;
  [key: string]: any;
}

export interface SelectedPlacePair {
  origin: PlaceItemType | null;
  destination: PlaceItemType | null;
  routeInfo?: {
    duration: number; // milliseconds
    distance: number; // meters
  } | null;
  errorMessage?: string | null;
}