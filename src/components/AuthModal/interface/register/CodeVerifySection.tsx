interface Props {
  code: string;
  onChange: (value: string) => void;
  onVerify: () => void;
  loading: boolean;
  error: string;
  timer: number;
}

const CodeVerifySection = ({ code, onChange, onVerify, loading, error, timer }: Props) => (
  <>
    <div className="relative flex gap-2 flex-col">
      <input
        type="text"
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // form submit 방지
                onVerify();         // 인증번호 확인 함수 실행
            }
        }}
        placeholder=" "
        className="peer p-3 py-1 border rounded w-full h-12 focus:border-[#D2B48C] focus:outline-none text-sm md:text-base"
      />
      <label className={`absolute left-2 transition-all bg-white px-1 ${
        code ? 'top-[-8px] text-xs' : 'top-3 text-sm text-gray-400'
      } peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-[#D2B48C]`}>
        Verification Code
      </label>
    </div>
    <button type="button" onClick={onVerify} disabled={loading}
            className="bg-[#555555] hover:bg-[#555544] text-white py-2 rounded flex justify-center items-center text-sm md:text-base cursor-pointer transition-all">
      {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin cursor-pointer" /> : 'Confirm'}
    </button>
    {timer > 0 && (
      <div className="pl-1 text-gray-500 text-xs">
        Remaining time: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}
      </div>
    )}

    <div className="pl-1 text-red-500 text-sm min-h-[20px]">{error}</div>
  </>
);

export default CodeVerifySection;
