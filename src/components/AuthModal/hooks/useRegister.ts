import axios from 'axios';
import { RegisterPayload, VerifyCodePayload } from '../../../types/auth/type';

export const useRegister = () => {
  const sendVerificationCode = async (email: string) => {
    const res = await axios.post('https://two025-ne-xt-be.onrender.com/api/email/send-code/', { email });
    return res.data;
  };

  const verifyCode = async (payload: VerifyCodePayload) => {
    const res = await axios.post('https://two025-ne-xt-be.onrender.com/api/email/verify-code/', payload);
    return res.data;
  };

  const register = async (payload: RegisterPayload) => {
    const res = await axios.post('https://two025-ne-xt-be.onrender.com/api/register/', payload);
    return res.data;
  };

  return { sendVerificationCode, verifyCode, register };
};
