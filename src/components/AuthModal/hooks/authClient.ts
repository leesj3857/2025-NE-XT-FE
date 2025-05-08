// src/api/authClient.ts
import { graphqlRequest } from '../../../api/graphqlClient';
import { LoginPayload } from '../../../types/auth/type';

export const authClient = {
  login: async (data: LoginPayload) => {
    const loginQuery = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          message
          access
          refresh
          email
          name
        }
      }
    `;

    const loginRes = await graphqlRequest(loginQuery, data);
    return loginRes.login
  }
};
