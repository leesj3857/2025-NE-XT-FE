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
    await graphqlRequest(query, { token }, token);
    return true;
  } catch (err) {
    return false;
  }
};