import { useCallback, useEffect, useState } from 'react';

const StepThree = ({
                     categories,
                     setCategories,
                     onNext,
                     onBack,
                   }: {
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
      <h2 className="text-xl md:text-2xl font-bold mb-10">What are you looking for?</h2>
      <div className="flex flex-col gap-4 mb-10">
        <label className="flex items-center gap-4 text-xl cursor-pointer">
          <input
            type="checkbox"
            checked={categories.food}
            onChange={() => toggle('food')}
          />
          Food spots
        </label>
        <label className="flex items-center gap-4 text-xl cursor-pointer">
          <input
            type="checkbox"
            checked={categories.sights}
            onChange={() => toggle('sights')}
          />
          Places to visit
        </label>
      </div>
      <div className="flex justify-between max-md:absolute max-md:bottom-0 w-full">
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

export default StepThree;
