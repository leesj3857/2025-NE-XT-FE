// store/searchSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  city: string;
  region: string;
  categories: {
    food: boolean;
    sights: boolean;
  };
}

const initialState: SearchState = {
  city: '',
  region: '',
  categories: {
    food: false,
    sights: false,
  },
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<SearchState>) => {
      return action.payload;
    },
  },
});

export const { setSearchParams } = searchSlice.actions;
export default searchSlice.reducer;
