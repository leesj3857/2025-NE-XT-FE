import { useEffect, useState, useCallback } from 'react';

const StepTwo = ({ region, setRegion, onNext, onBack }: {
  region: string;
  setRegion: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setShowButton(region.trim() !== '');
  }, [region]);

  const backButton = useCallback(() => {
    setRegion('')
    onBack()
  },[setRegion,onBack]);

  return (
    <div className="flex flex-col relative h-full">
      <h2 className="text-xl md:text-2xl font-bold mb-10">어느 지역이 궁금하신가요?</h2>
      <input
        type="text"
        placeholder="예: 강남역, 마포구, 해운대구 등"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className="w-full p-3 border border-[#CBCCCC] rounded mb-10 outline-none focus:border-[#2D3433] transition-all"
      />
      <div className="flex justify-between max-md:absolute max-md:bottom-0 w-full">
        <button onClick={backButton} className="text-[#2D3433] px-4 py-2 border border-[#2D3433] rounded cursor-pointer w-28">
          이전 단계
        </button>
        {showButton && (
          <button onClick={onNext} className="bg-[#2D3433] text-white px-6 py-2 rounded cursor-pointer w-28">
            다음 단계
          </button>
        )}
      </div>
    </div>
  );
};

export default StepTwo;