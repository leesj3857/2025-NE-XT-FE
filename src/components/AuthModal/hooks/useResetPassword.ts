import axios from 'axios';
import {
  ResetRequestPayload,
  ResetPasswordPayload,
  VerifyCodePayload
} from '../../../types/auth/type';

export const useResetPassword = () => {
  const sendResetCode = async (payload: ResetRequestPayload) => {
    const res = await axios.post('https://two025-ne-xt-be.onrender.com/api/password/send-reset-code/', payload);
    return res.data;
  };

  const verifyResetCode = async (payload: VerifyCodePayload) => {
    const res = await axios.post('https://two025-ne-xt-be.onrender.com/api/password/verify_reset_code/', payload);
    return res.data;
  };

  const resetPassword = async (payload: ResetPasswordPayload) => {
    const res = await axios.post('https://two025-ne-xt-be.onrender.com/api/password/reset/', payload);
    return res.data;
  };

  return { sendResetCode, verifyResetCode, resetPassword };
};
