import { useState,useRef } from 'react';
import {
  GoogleMap as GoogleMapComponent,
  LoadScript,
  Marker,
  InfoWindow
} from '@react-google-maps/api';
import { mdiMapMarker } from '@mdi/js';
import Icon from '@mdi/react';
import { useDispatch } from 'react-redux';
import { setSearchResults } from '../../store/slices/searchSlice';

interface MarkerType {
  lat: number;
  lng: number;
  title: string | undefined;
  category_name: string;
  road_address_name: string;
  photo?: google.maps.places.PlacePhoto
  place_id: string | undefined;
}

interface Props {
  keyword: string;
  markers: MarkerType[];
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const centerDefault = {
  lat: 37.5665,
  lng: 126.9780,
};

const GoogleMapWrapper = ({ keyword, markers }: Props) => {
  const [selected, setSelected] = useState<MarkerType | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const dispatch = useDispatch();

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    let allResults: google.maps.places.PlaceResult[] = [];
    const service = new google.maps.places.PlacesService(map);
    service.textSearch({ query: keyword }, (results, status, pagination) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        allResults = [...allResults, ...results];
        if (pagination && pagination.hasNextPage) {
          pagination.nextPage();
        } else {
          // 모든 페이지 완료되면 리덕스에 저장
          console.log(allResults)
          // 마커 표시용 변환도 필요하면 아래처럼 추가
        }
        dispatch(setSearchResults({ results: allResults }));
      }
    });
  };

  const center = markers.length > 0 ? markers[0] : centerDefault;

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      language="ko"
      libraries={['places']}
    >
      <GoogleMapComponent
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={handleMapLoad}
      >
        {markers.map((marker, i) => {
          const isSelected = selected?.lat === marker.lat && selected?.lng === marker.lng;

          return (
            <Marker
              key={i}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => {
                if (isSelected) {
                  setSelected(null);
                  setTimeout(() => setSelected(marker), 0);
                } else {
                  setSelected(marker);
                }
              }}
              icon={{
                url: '/marker.webp',
                scaledSize: new window.google.maps.Size(isSelected ? 55 : 36, isSelected ? 55 : 36),
              }}
            />
          );
        })}

        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
            options={{ pixelOffset: new window.google.maps.Size(0, -55) }}
          >
            <div className="min-w-[200px] max-w-[300px] text-sm font-medium text-black rounded-xl shadow-md">
              {'photo' in selected && selected.photo ? (
                <img
                  src={selected.photo.getUrl({ maxWidth: 80, maxHeight: 80 })}
                  alt="place"
                  className="w-32 mb-4 object-cover rounded-lg mr-2 relative"
                />
              ) : null}
              <h3 className="text-base font-bold mb-2">{selected.title}</h3>
              <div className="text-xs flex flex-col gap-2">
                {selected.category_name && (
                  <div className="flex items-center gap-1">
                    <Icon path={mdiMapMarker} size={0.7} color="#FF69B4" />
                    <span>{selected.category_name}</span>
                  </div>
                )}
                {selected.road_address_name && (
                  <div className="flex items-center gap-1">
                    <Icon path={mdiMapMarker} size={0.7} color="#FF69B4" />
                    <span>{selected.road_address_name}</span>
                  </div>
                )}
                <a
                  href={`https://www.google.com/maps/place/?q=place_id:${selected.place_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-xs mt-1"
                >
                  Google 지도에서 보기
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMapComponent>
    </LoadScript>
  );
};

export default GoogleMapWrapper;