import { setCategories } from '../slices/userSlice';
import { fetchUserCategoriesWithPlaces } from '../../components/User/utils/API';
import type { RootState, AppDispatch } from '../index';

export const fetchAndStoreUserCategories = () =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const token = getState().user.accessToken;
    if (!token) {
      console.warn('No access token found');
      return;
    }

    try {
      const data = await fetchUserCategoriesWithPlaces(token);
      dispatch(setCategories(data));
    } catch (err: any) {
      console.error('Failed to fetch categories:', err.message);
    }
  };
