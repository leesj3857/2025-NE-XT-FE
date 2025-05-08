import Icon from '@mdi/react';
import { mdiFolderOutline, mdiMap } from '@mdi/js';
import {PlaceItemType} from "../../../types/place/type.ts";


interface CategorySectionPCProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
  handleCategoryClick: (category: string) => void;
  savedPlaces: Record<string, { color: string; places: PlaceItemType[] }>;
}

const CategorySectionPC = ({ selectedCategory, onSelectCategory, savedPlaces, handleCategoryClick }: CategorySectionPCProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-[#1A1E1D] mb-5">📂 Categories</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-center">
          {Object.entries(savedPlaces).map(([category, { color }]) => {
            const isSelected = selectedCategory === category;
            return (
              <div
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`flex flex-col items-center justify-center rounded-lg cursor-pointer border border-transparent transition duration-200 w-[120px] aspect-square p-4 ${isSelected ? 'bg-opacity-20' : 'hover:bg-gray-100'}`}
                style={{ backgroundColor: isSelected ? `${color}20` : undefined }}
              >
                <Icon path={mdiFolderOutline} size={3.5} style={{ color }} className="mb-2 transition" />
                <span className="text-sm font-medium text-[#1A1E1D] truncate overflow-hidden w-full text-center break-words" >{category}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Places */}
      <div>
        <h3 className="text-lg font-semibold text-[#1A1E1D] mb-5 flex justify-between items-center">
          {selectedCategory ? `${selectedCategory} Places` : 'Select a category'}
          <span
            onClick={() => selectedCategory && handleCategoryClick(selectedCategory)}
            className="cursor-pointer hover:text-[#D2B48C] transition"
            title="View on Map"
          >
            <Icon path={mdiMap} size={1.5} className="transition" />
          </span>
        </h3>
        {selectedCategory && (
          <div className="flex flex-col gap-4">
            {savedPlaces[selectedCategory].places.map((place) => (
              <div key={place.placeName} className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
                <p className="font-medium text-[#1A1E1D]">{place.placeName}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySectionPC;