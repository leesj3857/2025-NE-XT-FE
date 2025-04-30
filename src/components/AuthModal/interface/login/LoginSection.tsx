interface Props {
  email: string;
  password: string;
  onChangeEmail: (v: string) => void;
  onChangePassword: (v: string) => void;
  onLogin: () => void;
  loading: boolean;
  error: string;
}

const LoginSection = ({
                        email, password, onChangeEmail, onChangePassword, onLogin, loading, error,
                      }: Props) => (
  <>
    {/* 이메일 */}
    <div className="relative">
      <input
        id="email"
        type="text"
        value={email}
        onChange={(e) => onChangeEmail(e.target.value)}
        placeholder=" "
        className="peer p-3 py-1 border rounded w-full h-12 focus:border-[#D2B48C] focus:outline-none text-sm md:text-base"
      />
      <label
        htmlFor="email"
        className="absolute left-2 bg-white px-1 transition-all
        peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
        peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-[#D2B48C]
        top-[-8px] text-xs text-[#1A1E1D]"
      >
        E-mail
      </label>
    </div>

    {/* 비밀번호 */}
    <div className="relative mt-1">
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => onChangePassword(e.target.value)}
        placeholder=" "
        className="peer p-3 py-1 border rounded w-full h-12 focus:border-[#D2B48C] focus:outline-none text-sm md:text-base"
      />
      <label
        htmlFor="password"
        className="absolute left-2 bg-white px-1 transition-all
        peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
        peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-[#D2B48C]
        top-[-8px] text-xs text-[#1A1E1D]"
      >
        Password
      </label>
    </div>

    <div className="text-red-500 text-sm">{error}</div>

    <button
      type="submit"
      onClick={onLogin}
      disabled={loading}
      className="bg-[#555555] hover:bg-[#555544] text-white text-[#1A1E1D] py-2 rounded flex justify-center items-center mt-2 cursor-pointer"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent animate-spin rounded-full" />
      ) : (
        'Login'
      )}
    </button>
  </>
);

export default LoginSection;
