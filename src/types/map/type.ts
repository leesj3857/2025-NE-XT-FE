import {PlaceItemType} from "../place/type.ts";

export interface MarkerType {
  id: string;
  title: string;
  address?: string;
  roadAddress?: string;
  roadAddressEN?: string;
  phone?: string;
  category?: string;
  categoryEN?: string;
  categoryGroupCode?: string;
  placeUrl?: string;
  x?: string;
  y?: string;
  lat: number;
  lng: number;
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