import Icon from '@mdi/react';
import { mdiFolderOutline } from '@mdi/js';

interface CategorySectionPCProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
  savedPlaces: Record<string, { color: string; places: string[] }>;
}

const CategorySectionPC = ({ selectedCategory, onSelectCategory, savedPlaces }: CategorySectionPCProps) => {
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
                <span className="text-sm font-medium text-[#1A1E1D] truncate overflow-hidden w-full text-center break-words">{category}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Places */}
      <div>
        <h3 className="text-lg font-semibold text-[#1A1E1D] mb-5">
          {selectedCategory ? `${selectedCategory} Places` : 'Select a category'}
        </h3>
        {selectedCategory && (
          <div className="flex flex-col gap-4">
            {savedPlaces[selectedCategory].places.map((place) => (
              <div key={place} className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
                <p className="font-medium text-[#1A1E1D]">{place}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySectionPC;