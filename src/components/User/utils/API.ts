import { graphqlRequest } from '../../../api/graphqlClient';
import {
  UPDATE_USER_CATEGORY_MUTATION,
  DELETE_USER_CATEGORY_MUTATION,
  DELETE_SAVED_PLACE_MUTATION,
  CREATE_USER_CATEGORY_MUTATION,
  GET_USER_CATEGORIES_QUERY,
  GET_SAVED_PLACES_BY_CATEGORY,
  CREATE_SAVED_PLACE,
  MOVE_SAVED_PLACE,
} from './queries';
import { PlaceItemType } from '../../../types/place/type';
interface SavedPlace {
  id: string;
  placeName: string;
  addressName: string;
  roadAddressName: string;
  phone: string;
  categoryName: string;
  placeUrl: string;
  menuOrTicketInfo: string;
  translatedReviews: string;
  createdAt: string;
  updatedAt: string;
}

interface UserCategoryWithPlaces {
  id: string;
  name: string;
  color: string;
  places: SavedPlace[];
}




export const createUserCategory = async (
  name: string,
  color: string,
  token: string
): Promise<{ id: string; name: string; color: string }> => {
  const variables = { name, color };

  const data = await graphqlRequest(CREATE_USER_CATEGORY_MUTATION, variables, token);

  if (!data?.createUserCategory) {
    throw new Error('Failed to create category');
  }

  return data.createUserCategory;
};

export const fetchUserCategoriesWithPlaces = async (token: string): Promise<UserCategoryWithPlaces[]> => {
  const categoryRes = await graphqlRequest(GET_USER_CATEGORIES_QUERY, {}, token);

  const categories = categoryRes?.userCategories || [];
  const placesPerCategory = await Promise.all(
    categories.map(async (cat: { id: string; name: string; color: string }) => {
      const placeRes = await graphqlRequest(
        GET_SAVED_PLACES_BY_CATEGORY,
        { categoryId: cat.id },
        token
      );
      const rawPlaces = placeRes?.savedPlacesByCategory || [];

      const parsedPlaces = rawPlaces.map((p: any): PlaceItemType => ({
        ...p,
        id: p.placeId,
        dataId: p.id,
        roadAddressNameEN: p.roadAddressNameEn || p.roadAddressNameEN,
        categoryNameEN: p.categoryNameEn || p.categoryNameEN,
      }));

      return {
        ...cat,
        places: parsedPlaces,
      };
    })
  );

  return placesPerCategory;
};

export const updateUserCategory = async (
  id: string,
  name: string,
  color: string,
  token: string
) => {
  const variables = { id, name, color };
  const res = await graphqlRequest(UPDATE_USER_CATEGORY_MUTATION, variables, token);
  if (!res?.updateUserCategory?.category) {
    throw new Error('Failed to update category');
  }
  return res.updateUserCategory.category;
};

export const deleteUserCategory = async (id: string, token: string) => {
  const res = await graphqlRequest(DELETE_USER_CATEGORY_MUTATION, { id }, token);
  if (!res?.deleteUserCategory?.message) {
    throw new Error('Failed to delete category');
  }
  return res.deleteUserCategory.message;
};

export const deleteSavedPlace = async (id: string, token: string) => {
  const res = await graphqlRequest(DELETE_SAVED_PLACE_MUTATION, { id }, token);
  if (!res?.deleteSavedPlace?.message) {
    throw new Error('Failed to delete saved place');
  }
  return res.deleteSavedPlace.message;
};

export const createSavedPlace = async (variables: any, token: string) => {
  const res = await graphqlRequest(CREATE_SAVED_PLACE, variables, token);
  if (!res?.createSavedPlace?.place) {
    throw new Error('Failed to create saved place');
  }
  return res.createSavedPlace;
};

export const moveSavedPlace = async (id: string, newCategoryId: string, token: string) => {
  const res = await graphqlRequest(MOVE_SAVED_PLACE, {
    id,
    newCategoryId
  }, token);
  if (!res?.moveSavedPlace?.place) {
    throw new Error('Failed to move saved place');
  }
  return res.moveSavedPlace;
};
