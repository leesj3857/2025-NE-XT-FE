import {PlaceItemType} from "../place/type.ts";

export interface MarkerType {
  id: string;
  lat: number;
  lng: number;
  title: string;
  address?: string;
  roadAddress?: string;
  roadAddressEN?: string;
  phone?: string;
  category?: string;
  categoryEN?: string;
  placeUrl?: string;
  [key: string]: any;
}

export interface NaverMapProps {
  markers: MarkerType[];
}

export interface CreateMarkersProps {
  map: any;
  markers: MarkerType[];
  infoWindowRef: any;
  selectedMarkerRef: React.MutableRefObject<any>;
  dispatch: any;
  origin: PlaceItemType | null;
  destination: PlaceItemType | null;
}