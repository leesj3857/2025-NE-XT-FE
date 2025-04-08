import { useState, useEffect } from 'react';

const StepOne = ({
                   city,
                   setCity,
                   onNext,
                 }: {
  city: string;
  setCity: (val: string) => void;
  onNext: () => void;
}) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // 선택된 도시가 있으면 버튼 표시
    setShowButton(city !== '');
  }, [city]);

  return (
    <div className="flex flex-col relative h-full">
      <h2 className="text-xl md:text-2xl font-bold mb-10">한국의 어디를 여행하실 건가요?</h2>
      <select
        className="w-full p-3 border border-[#CBCCCC] rounded mb-10 outline-none focus:border-[#2D3433] transition-all"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      >
        <option value="">도시를 선택하세요</option>
        <option value="서울">서울</option>
        <option value="부산">부산</option>
        <option value="대구">대구</option>
        <option value="제주">제주</option>
        <option value="기타">기타</option>
      </select>

      {showButton && (
        <div className="flex justify-end max-md:absolute max-md:bottom-0 max-md:right-0">
          <button
            onClick={onNext}
            className="bg-[#2D3433] text-white px-6 py-2 rounded cursor-pointer w-28 transition"
          >
            다음 단계
          </button>
        </div>
      )}
    </div>
  );
};

export default StepOne;