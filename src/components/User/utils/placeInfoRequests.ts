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
  const response = await graphqlRequest(APPROVE_PLACE_INFO_CHANGE_REQUEST, { id: Number(id) }, accessToken);
  return response.approvePlaceInfoChangeRequest;
};

export const rejectPlaceInfoChangeRequest = async (id: number, accessToken: string) => {
  const response = await graphqlRequest(REJECT_PLACE_INFO_CHANGE_REQUEST, { id: Number(id) }, accessToken);
  return response.rejectPlaceInfoChangeRequest;
};

const GET_USER_REPORTS_QUERY = `
  query GetUserReports {
    userReports {
      id
      reason
      createdAt
      placeReview {
        id
        text
        images
        rating
        user {
          id
          name
          email
        }
        placeInfo {
          id
          name
        }
      }
    }
  }
`;

const APPROVE_REVIEW_REPORT_MUTATION = `
  mutation ApprovePlaceInfoReviewByUserReport($id: Int!) {
    approvePlaceInfoReviewByUserReport(id: $id) {
      placeInfoReviewByUserReport {
        id
        isApproved
      }
      message
    }
  }
`;

const REJECT_REVIEW_REPORT_MUTATION = `
  mutation RejectPlaceInfoReviewByUserReport($id: Int!) {
    rejectPlaceInfoReviewByUserReport(id: $id) {
      message
    }
  }
`;

export interface ReviewReport {
  id: number;
  placeReview: {
    id: number;
    text: string;
    rating?: number;
    images?: string[];
    user: {
      id: number;
      name: string;
      email: string;
    };
    placeInfo: {
      id: number;
      name: string;
    };
  };
  reason?: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const getReviewReports = async (accessToken: string): Promise<ReviewReport[]> => {
  const response = await graphqlRequest(GET_USER_REPORTS_QUERY, {}, accessToken);
  return response.userReports;
};

export const approveReviewReport = async (reportId: number, accessToken: string): Promise<void> => {
  const response = await graphqlRequest(APPROVE_REVIEW_REPORT_MUTATION, { id: Number(reportId) }, accessToken);
  return response.approvePlaceInfoReviewByUserReport;
};

export const rejectReviewReport = async (reportId: number, accessToken: string): Promise<void> => {
  const response = await graphqlRequest(REJECT_REVIEW_REPORT_MUTATION, { id: Number(reportId) }, accessToken);
  return response.rejectPlaceInfoReviewByUserReport;
}; 