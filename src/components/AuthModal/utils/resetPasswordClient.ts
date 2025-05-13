// src/api/resetPasswordClient.ts
import { graphqlRequest } from '../../../api/graphqlClient';
import {
  ResetRequestPayload,
  ResetPasswordPayload,
  VerifyCodePayload
} from '../../../types/auth/type';

export const resetPasswordClient = {
  sendResetCode: async ({ email }: ResetRequestPayload) => {
    const query = `
      mutation SendReset($email: String!) {
        sendResetCode(email: $email) {
          message
        }
      }
    `;
    const response = await graphqlRequest(query, { email });
    return response.sendResetCode;
  },

  verifyResetCode: async (payload: VerifyCodePayload) => {
    const query = `
      mutation VerifyReset($email: String!, $code: String!) {
        verifyResetCode(email: $email, code: $code) {
          message
          token
        }
      }
    `;
    const response = await graphqlRequest(query, payload);
    return response.verifyResetCode;
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    const query = `
      mutation ResetPassword($email: String!, $token: String!, $newPassword: String!) {
        resetPassword(email: $email, token: $token, newPassword: $newPassword) {
          message
        }
      }
    `;
    const response = await graphqlRequest(query, payload);
    return response.resetPassword;
  }
};
