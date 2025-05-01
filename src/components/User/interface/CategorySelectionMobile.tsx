import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiFolderOutline } from '@mdi/js';
import { motion, AnimatePresence } from 'framer-motion';

interface SavedPlaces {
  [category: string]: {
    color: string;
    places: string[];
  };
}

interface CategorySectionMobileProps {
  savedPlaces: SavedPlaces;
}

const CategorySectionMobile = ({ savedPlaces }: CategorySectionMobileProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="relative w-full overflow-hidden p-2">
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.h3
            key="title-categories"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="text-lg font-semibold text-[#1A1E1D] mb-5"
          >
            📂 Categories
          </motion.h3>
        ) : (
          <motion.h3
            key="title-places"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4 }}
            className="text-lg font-semibold mb-2"
          >
            {selectedCategory} Places
          </motion.h3>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div
            key="categories"
            initial={{ x: '-110%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-110%', opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 gap-4 px-1"
          >
            {Object.entries(savedPlaces).map(([category, { color }]) => (
              <div
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="flex flex-col items-center justify-center
                 rounded-xl cursor-pointer bg-white shadow-md hover:shadow-lg
                 transition duration-200 border border-gray-200
                 w-full aspect-square p-4 space-y-2"
              >
                <Icon
                  path={mdiFolderOutline}
                  size={3}
                  style={{ color }}
                  className="transition"
                />
                <span className="text-sm font-medium text-[#1A1E1D] text-center break-words truncate overflow-hidden w-full">
                  {category}
                </span>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="places"
            initial={{ x: '110%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '110%', opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
          >
            <button
              className="flex items-center text-base text-[#0096C7] w-fit"
              onClick={() => setSelectedCategory(null)}
            >
              <Icon path={mdiChevronLeft} size={1} /> Back
            </button>
            {savedPlaces[selectedCategory].places.map((place) => (
              <div
                key={place}
                className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
              >
                <p className="font-medium text-[#1A1E1D]">{place}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategorySectionMobile;
