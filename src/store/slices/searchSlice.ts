// store/searchSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlaceItemType } from "../../types/place/type.ts";

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
  selectedPlaceId: null
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<SearchParamsPayload>) => {
      const { city, region, categories } = action.payload;
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
  },
});

export const { setSearchParams, setSearchResults, setCurrentPage, setSearchMeta, setSelectedPlaceId } = searchSlice.actions;
export default searchSlice.reducer;