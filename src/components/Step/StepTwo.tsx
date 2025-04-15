import { useEffect, useState, useCallback } from 'react';

const StepTwo = ({
                   region,
                   setRegion,
                   onNext,
                   onBack,
                 }: {
  region: string;
  setRegion: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}) => {
  const [showButton, setShowButton] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      if (region === '기타') {
        setRegion('');
      }
      setIsFirstLoad(false);
    }
    setShowButton(region.trim() !== '');
  }, [region]);

  const backButton = useCallback(() => {
    setRegion('');
    onBack();
  }, [setRegion, onBack]);

  const handleSkipRegion = () => {
    setRegion('기타');
    onNext();
  };

  return (
    <div className="flex flex-col relative h-full">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Which area are you interested in?</h2>

      <input
        type="text"
        placeholder="e.g., Gangnam Station, Mapo-gu, Haeundae-gu"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className="w-full p-3 border border-[#CBCCCC] rounded outline-none focus:border-[#2D3433] transition-all"
      />

      {/* 위치 모름 버튼 */}
      <div className="mt-6 mb-6 max-md:mt-4">
        <button
          onClick={handleSkipRegion}
          className="text-lg max-md:text-base text-[#2D3433] cursor-pointer border-b"
        >
          I don&apos;t know the exact location →
        </button>
        <p className="text-sm md:text-base text-gray-600 mt-2">
          ⚠️ Search range may become much wider. <br />
          🔍 You can re-search within a 1.5km radius from the map center.
        </p>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-between mt-4 max-md:absolute max-md:bottom-0 w-full">
        <button
          onClick={backButton}
          className="text-[#2D3433] px-4 py-2 border border-[#2D3433] rounded cursor-pointer w-28"
        >
          Previous
        </button>
        {showButton && (
          <button
            onClick={onNext}
            className="bg-[#2D3433] text-white px-6 py-2 rounded cursor-pointer w-28"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default StepTwo;
