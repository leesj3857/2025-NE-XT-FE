import { graphqlRequest } from '../../../api/graphqlClient';

const GET_PLACE_INFO_CHANGE_REQUESTS = `
  query GetPlaceInfoChangeRequests {
    placeInfoChangeRequests {
      id
      user {
        email
        name
      }
      placeInfo {
        id
        name
        address
        title
        language
        menuOrTicketInfo
        translatedReviews
      }
      newValue
      isApproved
      createdAt
    }
  }
`;

const APPROVE_PLACE_INFO_CHANGE_REQUEST = `
  mutation ApprovePlaceInfoChangeRequest($id: Int!) {
    approvePlaceInfoChangeRequest(id: $id) {
      placeInfoChangeRequest {
        id
        isApproved
      }
      message
    }
  }
`;

const REJECT_PLACE_INFO_CHANGE_REQUEST = `
  mutation RejectPlaceInfoChangeRequest($id: Int!) {
    rejectPlaceInfoChangeRequest(id: $id) {
      message
    }
  }
`;

export interface PlaceInfoChangeRequest {
  id: number;
  user: {
    email: string;
    name: string;
  };
  placeInfo: {
    id: string;
    name: string;
    address: string;
    title: string;
    language: string;
    menuOrTicketInfo: Array<{ name: string; price: string }>;
    translatedReviews: string[];
  };
  newValue: string;
  isApproved: boolean | null;
  createdAt: string;
}

export const getPlaceInfoChangeRequests = async (accessToken: string) => {
  const response = await graphqlRequest(GET_PLACE_INFO_CHANGE_REQUESTS, {}, accessToken);
  return response.placeInfoChangeRequests as PlaceInfoChangeRequest[];
};

export const approvePlaceInfoChangeRequest = async (id: number, accessToken: string) => {
  const response = await graphqlRequest(APPROVE_PLACE_INFO_CHANGE_REQUEST, { id }, accessToken);
  return response.approvePlaceInfoChangeRequest;
};

export const rejectPlaceInfoChangeRequest = async (id: number, accessToken: string) => {
  const response = await graphqlRequest(REJECT_PLACE_INFO_CHANGE_REQUEST, { id }, accessToken);
  return response.rejectPlaceInfoChangeRequest;
}; 