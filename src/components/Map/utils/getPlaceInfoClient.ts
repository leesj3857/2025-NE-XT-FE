import { graphqlRequest } from '../../../api/graphqlClient';

const GET_PLACE_INFO_MUTATION = `
  mutation GetPlaceInfoKorean($name: String!, $address: String!, $language: String!) {
    getPlaceInfoKorean(name: $name, address: $address, language: $language) {
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

const TRANSLATE_TEXT_MUTATION = `
  mutation TranslateText($text: String!, $targetLanguage: String!) {
    translateText(text: $text, targetLanguage: $targetLanguage) {
      translatedText
    }
  }
`;

const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  const response = await graphqlRequest(TRANSLATE_TEXT_MUTATION, {
    text,
    targetLanguage,
  });
  return response.translateText.translatedText;
};

const makeNumberedJoin = (arr: string[]) => arr.map((v, i) => `${i + 1}. ${v}`).join('');
const numberedSplit = (str: string, count: number) => {
  const regex = /\d+\. ?/g;
  const result: string[] = [];
  let match;
  const indices: number[] = [];
  while ((match = regex.exec(str)) !== null) {
    indices.push(match.index);
  }
  for (let i = 0; i < indices.length; i++) {
    const marker = str.slice(indices[i], indices[i] + (`${i + 1}.`).length + 1);
    let start = indices[i] + (`${i + 1}.`).length;
    if (marker.startsWith(`${i + 1}. `)) start += 1;
    const end = indices[i + 1] !== undefined ? indices[i + 1] : str.length;
    result.push(str.slice(start, end));
  }
  return result;
};

const translateMenuItems = async (menuItems: Array<{ name: string; price: string }>, targetLanguage: string) => {
  if (!menuItems.length) return [];
  const allTexts = menuItems.flatMap(item => [item.name, item.price]);
  const joined = makeNumberedJoin(allTexts);
  const translatedJoined = await translateText(joined, targetLanguage);
  const translatedArr = numberedSplit(translatedJoined, allTexts.length);
  const translatedMenuItems = [];
  for (let i = 0; i < translatedArr.length; i += 2) {
    translatedMenuItems.push({
      name: translatedArr[i],
      price: translatedArr[i + 1],
    });
  }
  return translatedMenuItems;
};

const translateReviews = async (reviews: string[], targetLanguage: string) => {
  if (reviews.length === 0) return [];
  const joined = makeNumberedJoin(reviews);
  const translatedJoined = await translateText(joined, targetLanguage);
  return numberedSplit(translatedJoined, reviews.length);
};

export const getPlaceInfo = async (
  name: string,
  address: string,
  language: string = '영어'
): Promise<PlaceInfo> => {
  const response = await graphqlRequest(GET_PLACE_INFO_MUTATION, {
    name,
    address,
    language,
  });

  const raw = response.getPlaceInfoKorean.place;

  // 메뉴 정보와 리뷰 번역
  const translatedMenuItems = raw.menuOrTicketInfo ? 
    await translateMenuItems(raw.menuOrTicketInfo, language) : 
    undefined;
  
  const translatedReviews = raw.translatedReviews ? 
    await translateReviews(raw.translatedReviews, language) : 
    undefined;

  const reviews = await getPlaceReviews(raw.id);
  
  return {
    id: raw.id,
    menuOrTicketInfo: translatedMenuItems,
    translatedReviews: translatedReviews,
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

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const createPlaceReview = async (
  placeInfoId: string,
  text: string,
  rating: number,
  images: string[],
  accessToken: string
) => {
  try {
    const response = await graphqlRequest(
      CREATE_PLACE_REVIEW_MUTATION,
      {
        placeInfoId,
        text,
        rating,
        images
      },
      accessToken
    );

    return response.createPlaceReview;
  } catch (error) {
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
  accessToken?: string
) => {
  try {
    const response = await graphqlRequest(
      CREATE_REVIEW_REPORT_MUTATION,
      {
        placeReviewId,
        reason
      },
      accessToken || ''
    );
    return response.createPlaceInfoReviewByUserReport;
  } catch (error) {
    throw error;
  }
};

