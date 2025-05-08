import { graphqlRequest } from '../../../api/graphqlClient';

export const verifyAccessToken = async (token: string): Promise<boolean> => {
  const query = `
    mutation VerifyToken($token: String!) {
      verifyToken(token: $token) {
        payload
      }
    }
  `;

  try {
    await graphqlRequest(query, { token }, token); // token도 인증 헤더에 포함
    return true;
  } catch (err) {
    return false;
  }
};