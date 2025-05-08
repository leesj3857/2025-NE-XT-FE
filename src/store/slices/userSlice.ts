import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string | null;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  name: null,
  email: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ name: string; email: string; accessToken: string; }>) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.name = null;
      state.email = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;