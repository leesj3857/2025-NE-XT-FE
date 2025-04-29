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
                                name, password, confirmPassword,
                                onChangeName, onChangePassword, onChangeConfirm,
                                onSubmit, loading, error, success
                              }: Props) => {
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
        <input type="text" value={name} onChange={(e) => onChangeName(e.target.value)} placeholder=" "
               className="peer p-3 py-1 border rounded w-full h-12 focus:border-blue-400 focus:outline-none text-sm md:text-base" />
        <label className={`absolute left-2 transition-all bg-white px-1 ${
          name ? 'top-[-8px] text-xs' : 'top-3 text-sm text-gray-400'
        } peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-blue-500`}>
          Name
        </label>
      </div>

      {/* 비밀번호 */}
      <div className="relative">
        <input type="password" value={password} onChange={(e) => onChangePassword(e.target.value)} placeholder=" "
               className="peer p-3 py-1 border rounded w-full h-12 focus:border-blue-400 focus:outline-none text-sm md:text-base" />
        <label className={`absolute left-2 transition-all bg-white px-1 ${
          password ? 'top-[-8px] text-xs' : 'top-3 text-sm text-gray-400'
        } peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-blue-500`}>
          Password
        </label>
      </div>

      {/* 비밀번호 확인 */}
      <div className="relative">
        <input type="password" value={confirmPassword} onChange={(e) => onChangeConfirm(e.target.value)} placeholder=" "
               className="peer p-3 py-1 border rounded w-full h-12 focus:border-blue-400 focus:outline-none text-sm md:text-base" />
        <label className={`absolute left-2 transition-all bg-white px-1 ${
          confirmPassword ? 'top-[-8px] text-xs' : 'top-3 text-sm text-gray-400'
        } peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-blue-500`}>
          Confirm Password
        </label>
      </div>

      <div className="text-red-500 text-sm ">{error}</div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm md:text-base flex justify-center items-center"
      >
        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Register'}
      </button>
    </div>
  );
};

export default PasswordInputSection;
