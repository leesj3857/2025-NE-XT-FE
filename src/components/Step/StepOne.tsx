import { useState, useEffect } from 'react';
import cityLabelMap from "./static/cityLabelMap.ts";

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
    setShowButton(city !== '');
  }, [city]);

  const cityOptions = [
    { value: '', label: 'Select a city or province' },
    ...Object.entries(cityLabelMap).map(([value, label]) => ({ value, label })),
  ];

  return (
    <div className="flex flex-col relative h-full">
      <h2 className="text-xl md:text-2xl font-bold mb-10">Where would you like to travel in Korea?</h2>
      <select
        className="w-full p-3 border border-[#CBCCCC] rounded mb-10 outline-none focus:border-[#2D3433] transition-all"
        value={city || ''}
        onChange={(e) => {
          setCity(e.target.value);
        }}
      >
        {cityOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {showButton && (
        <div className="flex justify-end max-md:absolute max-md:bottom-0 max-md:right-0">
          <button
            onClick={onNext}
            className="bg-[#2D3433] text-white px-6 py-2 rounded cursor-pointer w-28 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StepOne;
