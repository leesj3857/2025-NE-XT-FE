import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlaceItemType } from '../../types/place/type';

export interface UserCategoryWithPlaces {
  id: string;
  name: string;
  color: string;
  places: PlaceItemType[];
}

interface UserState {
  name: string | null;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isStaff: boolean;
  categories: UserCategoryWithPlaces[];
}

const initialState: UserState = {
  name: null,
  email: null,
  accessToken: null,
  refreshToken: null,
  isStaff: false,
  categories: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ name: string; email: string; accessToken: string; isStaff: boolean }>) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
      state.isStaff = action.payload.isStaff;
    },
    logout(state) {
      state.name = null;
      state.email = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isStaff = false;
    },
    setCategories(state, action: PayloadAction<UserCategoryWithPlaces[]>) {
      console.log(action.payload);
      state.categories = action.payload;
    },
  },
});

export const { login, logout, setCategories } = userSlice.actions;
export default userSlice.reducer;