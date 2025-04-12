import { useCallback, useEffect, useState } from 'react';

const StepThree = ({ categories, setCategories, onNext, onBack }: {
  categories: { food: boolean; sights: boolean };
  setCategories: (val: { food: boolean; sights: boolean }) => void;
  onNext: () => void;
  onBack: () => void;
}) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setShowButton(categories.food || categories.sights);
  }, [categories]);

  const toggle = (key: 'food' | 'sights') => {
    // 이미 선택된 항목을 클릭하면 해제, 아니면 그 항목만 선택
    if (categories[key]) {
      setCategories({ food: false, sights: false });
    } else {
      setCategories({ food: key === 'food', sights: key === 'sights' });
    }
  };

  const backButton = useCallback(() => {
    setCategories({ food: false, sights: false });
    onBack();
  }, [setCategories, onBack]);

  return (
    <div className="flex flex-col relative h-full">
      <h2 className="text-xl md:text-2xl font-bold mb-10">어떤 것을 찾고 계신가요?</h2>
      <div className="flex flex-col gap-4 mb-10">
        <label className="flex items-center gap-4 text-xl cursor-pointer">
          <input
            type="checkbox"
            checked={categories.food}
            onChange={() => toggle('food')}
          />
          맛집
        </label>
        <label className="flex items-center gap-4 text-xl cursor-pointer">
          <input
            type="checkbox"
            checked={categories.sights}
            onChange={() => toggle('sights')}
          />
          볼거리
        </label>
      </div>
      <div className="flex justify-between max-md:absolute max-md:bottom-0 w-full">
        <button
          onClick={backButton}
          className="text-[#2D3433] px-4 py-2 border border-[#2D3433] rounded cursor-pointer w-28"
        >
          이전 단계
        </button>
        {showButton && (
          <button
            onClick={onNext}
            className="bg-[#2D3433] text-white px-6 py-2 rounded cursor-pointer w-28"
          >
            다음 단계
          </button>
        )}
      </div>
    </div>
  );
};

export default StepThree;
