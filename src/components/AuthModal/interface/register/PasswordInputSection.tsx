import { useState } from 'react';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import Icon from '@mdi/react';

interface Props {
  name: string;
  password: string;
  confirmPassword: string;
  onChangeName: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeConfirm: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
  success: boolean;
}

const PasswordInputSection = ({
                                name,
                                password,
                                confirmPassword,
                                onChangeName,
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
        <h2 className="text-xl font-bold text-center mb-4">Welcome! You're now registered!</h2>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 이름 */}
      <div className="relative">
        <input
          type="text"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder=" "
          className="peer p-3 py-1 border rounded w-full h-12 focus:border-[#D2B48C] focus:outline-none text-sm md:text-base"
        />
        <label
          className={`absolute left-2 transition-all bg-white px-1 ${
            name ? 'top-[-8px] text-xs' : 'top-3 text-sm text-gray-400'
          } peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-[#D2B48C]`}
        >
          Name
        </label>
      </div>

      {/* 비밀번호 */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
          placeholder=" "
          className="peer p-3 py-1 pr-10 border rounded w-full h-12 focus:border-[#D2B48C] focus:outline-none text-sm md:text-base"
        />
        <label
          className={`absolute left-2 transition-all bg-white px-1 ${
            password ? 'top-[-8px] text-xs' : 'top-3 text-sm text-gray-400'
          } peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-[#D2B48C]`}
        >
          Password
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
          className="peer p-3 py-1 pr-10 border rounded w-full h-12 focus:border-[#D2B48C] focus:outline-none text-sm md:text-base"
        />
        <label
          className={`absolute left-2 transition-all bg-white px-1 ${
            confirmPassword ? 'top-[-8px] text-xs' : 'top-3 text-sm text-gray-400'
          } peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-[#D2B48C]`}
        >
          Confirm Password
        </label>
        <button
          type="button"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          className="absolute right-3 top-3 text-gray-500 focus:outline-none cursor-pointer"
        >
          <Icon path={showConfirmPassword ? mdiEyeOff : mdiEye} size={1} />
        </button>
      </div>

      <div className="text-red-500 text-sm">{error}</div>

      <button
        type="submit"
        onClick={onSubmit}
        disabled={loading}
        className="bg-[#555555] hover:bg-[#555544] text-white py-2 rounded text-sm md:text-base flex justify-center items-center transition-all"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          'Register'
        )}
      </button>
    </div>
  );
};

export default PasswordInputSection;
