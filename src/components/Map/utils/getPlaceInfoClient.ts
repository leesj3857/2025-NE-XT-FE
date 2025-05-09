// src/api/getPlaceInfoClient.ts
import { graphqlRequest } from '../../../api/graphqlClient';

const GET_PLACE_INFO_MUTATION = `
  mutation GetPlaceInfo($name: String!, $address: String!, $language: String!) {
    getPlaceInfo(name: $name, address: $address, language: $language) {
      place {
        name
        address
        language
        title
        category
        description
        price
        menuOrTicketInfo
        translatedReviews
      }
    }
  }
`;

interface PlaceInfo {
  name: string;
  address: string;
  language: string;
  title?: string;
  category?: string;
  description?: string;
  price?: string;
  menuOrTicketInfo?: Array<{ name: string; price: string }>;
  translatedReviews?: string[];
}

export const getPlaceInfo = async (
  name: string,
  address: string,
  language: string = 'EN'
): Promise<PlaceInfo> => {
  const response = await graphqlRequest(GET_PLACE_INFO_MUTATION, {
    name,
    address,
    language,
  });

  const raw = response.getPlaceInfo.place;


  return {
    name: raw.name,
    address: raw.address,
    language: raw.language,
    title: raw.title,
    category: raw.category,
    description: raw.description,
    price: raw.price,
    menuOrTicketInfo: raw.menuOrTicketInfo,
    translatedReviews: raw.translatedReviews,
  };
};
