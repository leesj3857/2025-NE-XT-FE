import { useState, useEffect } from 'react';
import { useKakaoPlaces } from '../hooks/findPlacesWithKeyword';
import KakaoMap from '../components/Map/KakaoMap.tsx';
import type { KakaoPlaceSearchParams } from '../types'
export default function Places() {
  const [input, setInput] = useState('');
  const [shouldFetch, setShouldFetch] = useState(false);
  const [params, setParams] = useState<KakaoPlaceSearchParams>({
    query: '',
    size: 10,
    sort: 'accuracy',
  });
  const { data: places, isLoading } = useKakaoPlaces(params, shouldFetch);
  useEffect(() => {
    if (shouldFetch && places) {
      setShouldFetch(false); // 다시 검색할 준비
    }
  }, [places]);
  const handleSearch = () => {
    setParams(prev => ({ ...prev, query: input.trim() }));
    setShouldFetch(true);
  };
  const markerData = places?.map((place: any) => ({
    lat: parseFloat(place.y),
    lng: parseFloat(place.x),
    title: place.place_name,
  })) ?? [];
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">장소 검색</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="검색할 장소 입력"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            검색
          </button>
        </div>

        {isLoading && <p className="text-center text-gray-500">검색 중...</p>}

        {places?.length === 0 && params && !isLoading && (
          <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
        )}

        <ul className="space-y-2 mb-6">
          {places?.map((place: any, idx: number) => (
            <li
              key={idx}
              className="p-4 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 transition"
            >
              <p className="font-semibold text-gray-800">{place.place_name}</p>
              <p className="text-sm text-gray-600">{place.address_name}</p>
            </li>
          ))}
        </ul>

        <KakaoMap markers={markerData} />
      </div>
    </div>
  );
}
