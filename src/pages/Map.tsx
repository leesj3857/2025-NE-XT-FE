import KakaoMap from '../components/Map/KakaoMap.tsx';
import BottomSheet from "../components/Map/BottomSheet.tsx";

const dummyPlaces = [
  { id: 1, name: '맛집 1', description: '매우 맛있는 한식당' },
  { id: 2, name: '볼거리 1', description: '유명한 박물관' },
  { id: 3, name: '맛집 2', description: '숨겨진 맛집' },
  { id: 4, name: '볼거리 2', description: '전통 시장' },
];

const ResultPage = () => {

  return (
    <div className="flex flex-col md:flex-row max-md:h-[calc(100vh-48px)] h-[calc(100vh-64px)] bg-[#DCE7EB]">
      {/* 모바일: 리스트는 바텀시트로 */}
      <div className="hidden md:block w-full md:w-[400px] bg-white p-4 overflow-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-4">추천 장소</h2>
        <ul className="space-y-4">
          {dummyPlaces.map((place) => (
            <li key={place.id} className="bg-[#e4ebed] p-4 rounded-xl shadow">
              <h3 className="font-bold text-lg mb-1">{place.name}</h3>
              <p className="text-sm">{place.description}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* 지도 영역 */}
      <div className="flex-1">
        <KakaoMap markers={[]} />
      </div>

      {/* 모바일 전용 바텀시트 */}
      <BottomSheet dummyPlaces={dummyPlaces} />
    </div>
  );
};

export default ResultPage;