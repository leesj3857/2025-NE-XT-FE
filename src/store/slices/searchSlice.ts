import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PlaceItem {
  id: string; // place_id
  name: string;
  formatted_address: string;
  lat: number;
  lng: number;
  types?: string[];
  business_status?: string;
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: any[];
  plus_code?: {
    compound_code?: string;
    global_code?: string;
  };
  price_level?: number;
  rating?: number;
  reference?: string;
  scope?: string;
  user_ratings_total?: number;
  vicinity?: string;
  phone?: string; // 추가 정보 얻은 경우
  [key: string]: any;
}

interface SearchParamsPayload {
  city: string;
  region: string;
  categories: {
    food: boolean;
    sights: boolean;
  };
}

interface SearchState {
  city: string;
  region: string;
  categories: { food: boolean; sights: boolean };
  keyword: string;
  results: google.maps.places.PlaceResult[];
}

const initialState: SearchState = {
  city: '',
  region: '',
  categories: {
    food: false,
    sights: false,
  },
  keyword: '',
  results: [],
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
      state.results = [];
    },
    setSearchResults: (state, action: PayloadAction<{ results: google.maps.places.PlaceResult[] }>) => {
      const { results } = action.payload;
      state.results = results;
    },
  },
});

export const { setSearchParams, setSearchResults } = searchSlice.actions;
export default searchSlice.reducer;