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

const GET_PLACE_REVIEWS_QUERY = `
  query GetPlaceReviews($placeInfoId: ID!) {
    placeReviews(placeInfoId: $placeInfoId) {
      id
      text
      rating
      images
      createdAt
      user {
        id
        name
      }
    }
  }
`;

interface PlaceReview {
  id: string;
  text: string;
  rating: number;
  images: string[];
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

interface PlaceInfo {
  id: string;
  menuOrTicketInfo?: Array<{ name: string; price: string }>;
  translatedReviews?: string[];
  referenceUrls?: string[];
  reviews?: PlaceReview[];
}

export const getPlaceReviews = async (placeInfoId: string): Promise<PlaceReview[]> => {
  const response = await graphqlRequest(GET_PLACE_REVIEWS_QUERY, {
    placeInfoId,
  });
  return response.placeReviews;
};

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
  
  // 장소 정보를 가져온 후 리뷰 정보도 함께 가져옵니다
  const reviews = await getPlaceReviews(raw.id);

  return {
    id: raw.id,
    menuOrTicketInfo: raw.menuOrTicketInfo,
    translatedReviews: raw.translatedReviews,
    referenceUrls: typeof raw.referenceUrls === 'string' ? JSON.parse(raw.referenceUrls) : raw.referenceUrls,
    reviews,
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
    newValue: JSON.stringify(newValue),
  }, accessToken);
  return res.createPlaceInfoChangeRequest;
};

const CREATE_PLACE_REVIEW_MUTATION = `
  mutation CreatePlaceReview($placeInfoId: ID!, $text: String!, $rating: Int!, $images: [String]) {
    createPlaceReview(
      placeInfoId: $placeInfoId
      text: $text
      rating: $rating
      images: $images
    ) {
      review {
        id
        text
        rating
        images
        createdAt
      }
      message
    }
  }
`;

// 파일을 base64로 변환하는 유틸리티 함수
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// 리뷰 등록 함수
export const createPlaceReview = async (
  placeInfoId: string,
  text: string,
  rating: number,
  images: File[],
  accessToken: string
) => {
  try {
    // 이미지 파일들을 base64로 변환
    const base64Images = await Promise.all(
      images.map(file => fileToBase64(file))
    );

    const response = await graphqlRequest(
      CREATE_PLACE_REVIEW_MUTATION,
      {
        placeInfoId,
        text,
        rating,
        images: base64Images
      },
      accessToken
    );

    return response.createPlaceReview;
  } catch (error) {
    console.error('리뷰 등록 중 오류 발생:', error);
    throw error;
  }
};

const CREATE_REVIEW_REPORT_MUTATION = `
  mutation CreatePlaceInfoReviewByUserReport(
    $placeReviewId: ID!
    $reason: String
  ) {
    createPlaceInfoReviewByUserReport(
      placeReviewId: $placeReviewId
      reason: $reason
    ) {
      placeInfoReviewByUserReport {
        id
        placeReview {
          id
          text
        }
        reason
        createdAt
      }
      message
    }
  }
`;

export const reportReview = async (
  placeReviewId: string,
  reason: string | undefined,
  accessToken: string
) => {
  try {
    const response = await graphqlRequest(
      CREATE_REVIEW_REPORT_MUTATION,
      {
        placeReviewId,
        reason
      },
      accessToken
    );
    return response.createPlaceInfoReviewByUserReport;
  } catch (error) {
    console.error('리뷰 신고 중 오류 발생:', error);
    throw error;
  }
};
