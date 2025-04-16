import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import queryString from 'query-string';
import { clearOriginPlace, clearDestinationPlace, clearRouteInfo, clearRouteErrorMessage } from "../../store/slices/searchSlice.ts";
import cityLabelMap from "./static/cityLabelMap.ts";

const StepSummary = ({ city, region, regionEN, categories, onBack }: {
  city: string;
  region: string;
  regionEN: string;
  categories: { food: boolean; sights: boolean };
  onBack: () => void;
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = async () => {
    setIsSearching(true);
    dispatch(clearOriginPlace());
    dispatch(clearDestinationPlace());
    dispatch(clearRouteInfo());
    dispatch(clearRouteErrorMessage())
    const delay = new Promise((resolve) => setTimeout(resolve, 4000));
    await delay;

    const query = queryString.stringify({
      type: 'keyword',
      city,
      region,
      food: categories.food,
      sights: categories.sights,
    });

    navigate(`/map?${query}`);
  };

  const cityLabel = city ? (cityLabelMap[city] || city) : 'Not specified';
  const regionLabel = regionEN === 'Not specified' || !regionEN ? 'Not specified' : regionEN;

  return (
    <div className="flex flex-col relative h-full overflow-hidden">
      {!isSearching ? (
        <>
          <h2 className="text-xl md:text-2xl font-bold mb-10">Please review the information you entered.</h2>
          <ul className="mb-10 max-md:text-lg text-xl space-y-3">
            <li><strong>Destination city :</strong> {cityLabel}</li>
            <li><strong>Specific area :</strong> {regionLabel}</li>
            <li><strong>Selected category :</strong> {categories.food && 'Food spots'} {categories.food && categories.sights && ' / '} {categories.sights && 'Places to visit'}</li>
          </ul>
          <div className="flex justify-between max-md:absolute max-md:bottom-0 w-full">
            <button onClick={onBack} className="text-[#2D3433] px-4 py-2 border border-[#2D3433] rounded cursor-pointer w-28">
              Previous
            </button>
            <button onClick={handleSearch} className="bg-[#2D3433] text-white px-6 py-2 rounded cursor-pointer w-28">
              Search
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <motion.div
            initial={{ x: -500 }}
            animate={{ x: [ -500, 550 ] }}
            transition={{ duration: 4 }}
            className="text-4xl mb-6"
          >
            <img
              src="/airplane.webp"
              width="150px"
              alt=""
              draggable={false}
              tabIndex={-1}
              style={{ outline: 'none' }}
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl font-medium"
          >
            Searching for {categories.food && 'Food spots'}{categories.sights && 'Places to visit'} in the selected area!
          </motion.p>
        </div>
      )}
    </div>
  );
};

export default StepSummary;
