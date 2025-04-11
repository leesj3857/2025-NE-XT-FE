export interface MarkerType {
  id: string;
  lat: number;
  lng: number;
  title: string;
  address: string;
  roadAddress: string;
  phone?: string;
  category?: string;
  placeUrl?: string;
}

export interface NaverMapProps {
  markers: MarkerType[];
}

export interface CreateMarkersProps {
  map: any;
  markers: MarkerType[];
  infoWindowRef: any;
  selectedMarkerRef: React.MutableRefObject<any>;
}