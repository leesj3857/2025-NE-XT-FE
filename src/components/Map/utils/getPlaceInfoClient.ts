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

  // 정제 처리
  let menuOrTicketInfo: Array<{ name: string; price: string }> = [];
  let translatedReviews: string[] = [];

  try {
    if (typeof raw.menuOrTicketInfo === 'string') {
      menuOrTicketInfo = JSON.parse(raw.menuOrTicketInfo);
    }
  } catch (e) {
    console.warn('menuOrTicketInfo 파싱 실패:', e);
  }

  try {
    if (typeof raw.translatedReviews === 'string') {
      translatedReviews = JSON.parse(raw.translatedReviews);
    }
  } catch (e) {
    console.warn('translatedReviews 파싱 실패:', e);
  }

  return {
    name: raw.name,
    address: raw.address,
    language: raw.language,
    title: raw.title,
    category: raw.category,
    description: raw.description,
    price: raw.price,
    menuOrTicketInfo,
    translatedReviews,
  };
};
