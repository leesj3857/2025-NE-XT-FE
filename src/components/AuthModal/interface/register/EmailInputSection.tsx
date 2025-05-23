interface Props {
  email: string;
  onChange: (value: string) => void;
  onSendCode: () => void;
  loading: boolean;
  error: string;
  message: string;
}

const EmailInputSection = ({ email, onChange, onSendCode, loading, error, message }: Props) => (
  <>
    <div className="relative">
      <input
        type="text"
        value={email}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // form submit 방지
                onSendCode();       // 이메일 전송 함수 실행
            }
        }}
        placeholder=" "
        className="peer p-3 py-1 border rounded w-full h-12 focus:border-[#D2B48C] focus:outline-none text-sm md:text-base"
      />
      <label className={`absolute left-2 transition-all bg-white px-1 ${
        email ? 'top-[-8px] text-xs' : 'top-3 text-sm text-gray-400'
      } peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-[#D2B48C]`}>
        E-mail
      </label>
    </div>

    <button type="button" onClick={onSendCode} disabled={loading}
            className="bg-[#0096C7] hover:bg-[#1ABC9C] text-white py-2 rounded flex justify-center items-center text-sm md:text-base cursor-pointer transition-all">
      {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Send Verification Code'}
    </button>

    <div className={`text-sm min-h-[20px] mb-2 ${error ? 'text-red-500' : 'text-green-600'}`}>
      {error || (message && (
        <>
          {message}
          <br />
          <span className="text-xs md:text-sm">If you haven't received the email, please check your spam folder.</span>
        </>
      ))}
    </div>
  </>
);

export default EmailInputSection;
