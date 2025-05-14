import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlaceItemType, SelectedPlacePair } from "../../types/place/type.ts";

interface SearchParamsPayload {
  city: string;
  region: string;
  categories: {
    food: boolean;
    sights: boolean;
  };
}

export interface KakaoPlaceMeta {
  total_count: number; // 검색된 전체 문서 수
  pageable_count: number; // 출력 가능한 문서 수 (최대 45)
  is_end: boolean; // 마지막 페이지 여부
  same_name: {
    region: string[]; // 인식된 지역 리스트
    keyword: string; // 지역 제외 키워드
    selected_region: string; // 실제 검색에 사용된 지역
  };
}

interface SearchState {
  city: string;
  region: string;
  categories: { food: boolean; sights: boolean };
  keyword: string;
  resultsByPage: Record<number, PlaceItemType[]>;
  currentPage: number;
  meta: KakaoPlaceMeta | null;
  selectedPlaceId: string | null;
  selectedPlacePair: SelectedPlacePair;
  selectedDetailedPlace: PlaceItemType | null;
}

const initialState: SearchState = {
  city: '',
  region: '',
  categories: {
    food: false,
    sights: false,
  },
  keyword: '',
  resultsByPage: {},
  currentPage: 1,
  meta: null,
  selectedPlaceId: null,
  selectedPlacePair: {
    origin: null,
    destination: null,
    routeInfo: null,
    errorMessage: null,
  },
  selectedDetailedPlace: null,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<SearchParamsPayload>) => {
      let { city, region, categories } = action.payload;

      // '기타'는 빈 문자열로 대체
      city = city === '기타' ? '' : city;
      region = region === '기타' ? '' : region;

      state.city = city;
      state.region = region;
      state.categories = categories;

      state.keyword = [city, region, categories.food && '맛집', categories.sights && '볼거리']
        .filter(Boolean)
        .join(' ');

      state.resultsByPage = {};
      state.currentPage = 1;
    },
    setSearchResults: (state, action: PayloadAction<{ page: number; results: PlaceItemType[] }>) => {
      const { page, results } = action.payload;
      state.resultsByPage[page] = results;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSearchMeta: (state, action: PayloadAction<KakaoPlaceMeta>) => {
      state.meta = action.payload;
    },
    setSelectedPlaceId(state, action) {
      state.selectedPlaceId = action.payload;
    },
    setOriginPlace(state, action: PayloadAction<PlaceItemType>) {
      state.selectedPlacePair.origin = action.payload;
    },
    setDestinationPlace(state, action: PayloadAction<PlaceItemType>) {
      state.selectedPlacePair.destination = action.payload;
    },
    setRouteInfo(
      state,
      action: PayloadAction<{ duration: number; distance: number }>
    ) {
      if (state.selectedPlacePair) {
        state.selectedPlacePair.routeInfo = {
          duration: action.payload.duration,
          distance: action.payload.distance,
        };
      }
    },
    setRouteErrorMessage(state, action: PayloadAction<string>) {
      if (state.selectedPlacePair) {
        state.selectedPlacePair.errorMessage = action.payload;
      }
    },
    setSelectedDetailedPlace(state, action) {
      state.selectedDetailedPlace = action.payload;
    },
    clearSelectedPlacePair(state) {
      state.selectedPlacePair = { origin: null, destination: null };
    },
    clearOriginPlace(state) {
      state.selectedPlacePair.origin = null;
    },
    clearDestinationPlace(state) {
      state.selectedPlacePair.destination = null;
    },
    clearRouteInfo(state) {
      if (state.selectedPlacePair) {
        state.selectedPlacePair.routeInfo = null;
      }
    },
    clearRouteErrorMessage(state) {
      if (state.selectedPlacePair) {
        state.selectedPlacePair.errorMessage = null;
      }
    },
    clearSelectedDetailedPlace(state) {
      if (state.selectedDetailedPlace) {
        state.selectedDetailedPlace = null;
      }
    }
  },
});

export const { setSearchParams, setSearchResults, setCurrentPage, setSearchMeta, setSelectedPlaceId, setOriginPlace,
  setDestinationPlace, clearSelectedPlacePair, clearOriginPlace, clearDestinationPlace, setRouteInfo, clearRouteInfo, setRouteErrorMessage, clearRouteErrorMessage, setSelectedDetailedPlace, clearSelectedDetailedPlace } = searchSlice.actions;
export default searchSlice.reducer;