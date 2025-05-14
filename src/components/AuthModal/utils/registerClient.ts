import { graphqlRequest } from '../../../api/graphqlClient';
import { RegisterPayload, VerifyCodePayload } from '../../../types/auth/type';

export const registerClient = {
  sendVerificationCode: async (email: string) => {
    const query = `
      mutation SendCode($email: String!) {
        sendVerificationCode(email: $email) {
          message
        }
      }
    `;
    const response = await graphqlRequest(query, { email });
    return response.sendVerificationCode;
  },

  verifyCode: async (payload: VerifyCodePayload) => {
    const query = `
      mutation VerifyEmail($email: String!, $code: String!) {
        verifyEmailCode(email: $email, code: $code) {
          message
          token
        }
      }
    `;
    const response = await graphqlRequest(query, payload);
    return response.verifyEmailCode;
  },

  register: async (payload: RegisterPayload) => {
    const query = `
      mutation Register($email: String!, $name: String!, $password: String!, $token: String!) {
        register(email: $email, name: $name, password: $password, token: $token) {
          message
        }
      }
    `;
    const response = await graphqlRequest(query, payload);
    return response.register;
  }
};
