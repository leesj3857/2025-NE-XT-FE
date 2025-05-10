export const UPDATE_USER_CATEGORY_MUTATION = `
  mutation UpdateUserCategory($id: ID!, $name: String!, $color: String) {
    updateUserCategory(id: $id, name: $name, color: $color) {
      category {
        id
        name
        color
      }
      message
    }
  }
`;

export const DELETE_USER_CATEGORY_MUTATION = `
  mutation DeleteUserCategory($id: ID!) {
    deleteUserCategory(id: $id) {
      message
    }
  }
`;

export const DELETE_SAVED_PLACE_MUTATION = `
  mutation DeleteSavedPlace($id: ID!) {
    deleteSavedPlace(id: $id) {
      message
    }
  }
`;

export const CREATE_USER_CATEGORY_MUTATION = `
  mutation CreateUserCategory($name: String!, $color: String) {
    createUserCategory(name: $name, color: $color) {
      category {
        id
        name
        color
      }
      message   
    }
  }
`;

export const GET_USER_CATEGORIES_QUERY = `
  query {
    userCategories {
      id
      name
      color
    }
  }
`;

export const GET_SAVED_PLACES_BY_CATEGORY = `
  query GetSavedPlaces($categoryId: ID!) {
    savedPlacesByCategory(categoryId: $categoryId) {
      id
      placeId
      placeName
      addressName
      roadAddressName
      roadAddressNameEn
      phone
      categoryName
      categoryNameEn
      placeUrl
      categoryGroupCode
      x
      y
      lat
      lng
      createdAt
    }
  }
`;

export const CREATE_SAVED_PLACE = `
mutation CreateSavedPlace(
  $categoryId: ID!,
  $placeId: String!,
  $placeName: String!,
  $addressName: String,
  $roadAddressName: String,
  $roadAddressNameEn: String,
  $phone: String,
  $categoryName: String,
  $categoryNameEn: String,
  $placeUrl: String,
  $categoryGroupCode: String,
  $x: String,
  $y: String,
  $lat: String,
  $lng: String
) {
  createSavedPlace(
    categoryId: $categoryId,
    placeId: $placeId,
    placeName: $placeName,
    addressName: $addressName,
    roadAddressName: $roadAddressName,
    roadAddressNameEn: $roadAddressNameEn,
    phone: $phone,
    categoryName: $categoryName,
    categoryNameEn: $categoryNameEn,
    placeUrl: $placeUrl,
    categoryGroupCode: $categoryGroupCode,
    x: $x,
    y: $y,
    lat: $lat,
    lng: $lng
  ) {
    place {
      id
      placeId
      placeName
      addressName
      roadAddressName
      roadAddressNameEn
      phone
      categoryName
      categoryNameEn
      placeUrl
      categoryGroupCode
      x
      y
      lat
      lng
      createdAt
    }
    message
  }
}
`;

export const MOVE_SAVED_PLACE = `
mutation MoveSavedPlace($id: ID!, $newCategoryId: ID!) {
  moveSavedPlace(id: $id, newCategoryId: $newCategoryId) {
    place {
      id
      placeId
      placeName
      category {
        id
        name
      }
    }
    message
  }
}
`;
