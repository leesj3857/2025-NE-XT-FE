// src/api/getPlaceInfoClient.ts
import { graphqlRequest } from '../../../api/graphqlClient';

const GET_PLACE_INFO_MUTATION = `
  mutation GetPlaceInfo($name: String!, $address: String!, $language: String!) {
    getPlaceInfo(name: $name, address: $address, language: $language) {
      place {
        id
        menuOrTicketInfo
        translatedReviews
        referenceUrls
      }
    }
  }
`;

interface PlaceInfo {
  id: string;
  menuOrTicketInfo?: Array<{ name: string; price: string }>;
  translatedReviews?: string[];
  referenceUrls?: string[];
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
    id: raw.id,
    menuOrTicketInfo: raw.menuOrTicketInfo,
    translatedReviews: raw.translatedReviews,
    referenceUrls: raw.referenceUrls,
  };
};

const CREATE_CHANGE_REQUEST_MUTATION = `
  mutation CreatePlaceInfoChangeRequest($placeInfoId: Int!, $newValue: JSONString!) {
    createPlaceInfoChangeRequest(placeInfoId: $placeInfoId, newValue: $newValue) {
      placeInfoChangeRequest {
        id
        placeInfo { id }
        newValue
        isApproved
      }
      message
    }
  }
`;

export const submitChangeRequest = async (placeInfoId: string, newValue: any, accessToken: string) => {
  const res = await graphqlRequest(CREATE_CHANGE_REQUEST_MUTATION, {
    placeInfoId: parseInt(placeInfoId, 10),
    newValue: JSON.stringify({ menuOrTicketInfo: newValue }),
  }, accessToken);
  return res.createPlaceInfoChangeRequest;
};
