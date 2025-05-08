import { useState } from 'react';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import Icon from '@mdi/react';
import PasswordRules from '../PasswordRules';

interface Props {
  email: string;
  password: string;
  confirmPassword: string;
  onChangePassword: (value: string) => void;
  onChangeConfirm: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
  success: boolean;
}

const ResetNewPasswordSection = ({
                                   email,
                                   password,
                                   confirmPassword,
                                   onChangePassword,
                                   onChangeConfirm,
                                   onSubmit,
                                   loading,
                                   error,
                                   success,
                                 }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (success) {
    return (
      <>
        <h2 className="text-xl font-bold text-center mb-4">Your password has been changed!</h2>
      </>
    );
  }

  return (
    <>
      {/* 새 비밀번호 */}
      <div className="relative mb-2">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === ' ') e.preventDefault(); // ← 스페이스바 무효화
          }}
          placeholder=" "
          className="peer p-2 py-1 pr-10 border rounded w-full h-12 focus:border-[#D2B48C] focus:outline-none text-sm md:text-base"
        />
        <label
          htmlFor="password"
          className={`absolute left-2 transition-all bg-white px-1 pointer-events-none ${
            password ? 'top-[-8px] text-xs' : 'top-3 text-sm text-gray-400'
          } peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-[#D2B48C]`}
        >
          New Password
        </label>
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-3 text-gray-500 focus:outline-none cursor-pointer"
        >
          <Icon path={showPassword ? mdiEyeOff : mdiEye} size={1} />
        </button>
      </div>

      {/* 비밀번호 확인 */}
      <div className="relative">
        <input
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => onChangeConfirm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === ' ') e.preventDefault(); // ← 스페이스바 무효화
          }}
          placeholder=" "
          className="peer p-2 py-1 pr-10 border rounded w-full h-12 focus:border-[#D2B48C] focus:outline-none text-sm md:text-base"
        />
        <label
          htmlFor="confirmPassword"
          className={`absolute left-2 transition-all bg-white px-1 pointer-events-none ${
            confirmPassword ? 'top-[-8px] text-xs' : 'top-3 text-sm text-gray-400'
          } peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-[#D2B48C]`}
        >
          Confirm New Password
        </label>
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          className="absolute right-3 top-3 text-gray-500 focus:outline-none cursor-pointer"
        >
          <Icon path={showConfirmPassword ? mdiEyeOff : mdiEye} size={1} />
        </button>
      </div>
      <PasswordRules password={password} email={email} />
      <div className="text-red-500 text-sm min-h-[20px] mt-1">{error}</div>

      <button
        type="submit"
        onClick={onSubmit}
        disabled={loading}
        className="bg-[#555555] hover:bg-[#555544] text-white py-2 rounded text-sm md:text-base flex justify-center items-center transition-all"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          'Password Reset'
        )}
      </button>
    </>
  );
};

export default ResetNewPasswordSection;