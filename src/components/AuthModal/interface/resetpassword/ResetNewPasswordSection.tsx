import { useState } from 'react';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import Icon from '@mdi/react';

interface Props {
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
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
          placeholder=" "
          className="peer p-2 py-1 pr-10 border rounded w-full h-12 focus:border-[#D2B48C] focus:outline-none text-sm md:text-base"
        />
        <label
          className={`absolute left-2 transition-all bg-white px-1 ${
            password ? 'top-[-8px] text-xs' : 'top-3 text-sm text-gray-400'
          } peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-[#D2B48C]`}
        >
          New Password
        </label>
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-3 text-gray-500 focus:outline-none cursor-pointer"
        >
          <Icon path={showPassword ? mdiEyeOff : mdiEye} size={1} />
        </button>
      </div>

      {/* 비밀번호 확인 */}
      <div className="relative">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => onChangeConfirm(e.target.value)}
          placeholder=" "
          className="peer p-2 py-1 pr-10 border rounded w-full h-12 focus:border-[#D2B48C] focus:outline-none text-sm md:text-base"
        />
        <label
          className={`absolute left-2 transition-all bg-white px-1 ${
            confirmPassword ? 'top-[-8px] text-xs' : 'top-3 text-sm text-gray-400'
          } peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-[#D2B48C]`}
        >
          Confirm New Password
        </label>
        <button
          type="button"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          className="absolute right-3 top-3 text-gray-500 focus:outline-none cursor-pointer"
        >
          <Icon path={showConfirmPassword ? mdiEyeOff : mdiEye} size={1} />
        </button>
      </div>

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