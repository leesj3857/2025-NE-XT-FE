import React, { useState } from 'react';
import { PlaceItemType } from '../../../types/place/type';
import { motion } from 'framer-motion';
import Icon from '@mdi/react';
import { mdiFolder, mdiPlus, mdiMinusCircleOutline, mdiMapMarker } from '@mdi/js';
import DeleteModal from '../../../interface/DeleteModal';

interface SavePlaceModalProps {
  place: PlaceItemType;
  onClose: () => void;
}

interface Category {
  name: string;
  color: string;
}

const initialCategories: Category[] = [
  { name: 'Favorites', color: '#F59E0B' },
  { name: 'Want to Visit', color: '#10B981' },
  { name: 'Recommended', color: '#3B82F6' },
  { name: 'Hidden Gems', color: '#8B5CF6' },
  { name: 'Favorites1', color: '#F59E0B' },
  { name: 'Want to Visit1', color: '#10B981' },
  { name: 'Recommended1', color: '#3B82F6' },
  { name: 'Hidden Gems1', color: '#8B5CF6' },
  { name: 'Favorites2', color: '#F59E0B' },
  { name: 'Want to Visit2', color: '#10B981' },
  { name: 'Recommended2', color: '#3B82F6' },
  { name: 'Hidden Gems2', color: '#8B5CF6' },
  { name: 'Favorites3', color: '#F59E0B' },
  { name: 'Want to Visit3', color: '#10B981' },
  { name: 'Recommended3', color: '#3B82F6' },
  { name: 'Hidden Gems3', color: '#8B5CF6' },
  { name: 'Favorites4', color: '#F59E0B' },
  { name: 'Want to Visit4', color: '#10B981' },
  { name: 'Recommended4', color: '#3B82F6' },
  { name: 'Hidden Gems4', color: '#8B5CF6' },
];

const SavePlaceModal = ({ place, onClose }: SavePlaceModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#F87171'); // 기본색
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleSave = () => {
    onClose();
  };

  const handleAddCategory = () => {
    if (!newName.trim()) {
      setErrorMessage('Please enter a category name.');
      return;
    }
  
    setCategories([...categories, { name: newName.trim(), color: newColor }]);
    setNewName('');
    setNewColor('#F87171');
    setShowAddForm(false);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 cursor-default" 
    style={{ zIndex: 101 }} onClick={(e) => e.stopPropagation()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 max-h-[75%] flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Icon path={mdiMapMarker} size={1} color="#EF4444" />
            Save Place
          </h2>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="text-sm text-blue-600 hover:underline"
          >
            {isEditMode ? 'Done Editing' : 'Edit'}
          </button>
        </div>
        <div className="mb-4 space-y-1">
          <p className="text-sm text-gray-600">
            Choose a category for <strong>{place.placeName}</strong>
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Current Saved Category :{' '}
            <span className="font-medium text-gray-700 flex gap-0.5">
              <Icon path={mdiFolder} size={0.8} color="#6B7280" />
              {selectedCategory ?? ''}
            </span>
          </p>
        </div>
        {/* 카테고리 목록 */}
        <div className="grid grid-cols-2 gap-3 mb-4 overflow-y-auto pr-2">
          {categories.map(({ name, color }) => {
            const isSelected = selectedCategory === name;
            return (
              <div
                key={name}
                onClick={() => {
                  if (!isEditMode) {
                    setSelectedCategory(selectedCategory === name ? null : name);
                  }
                }}
                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition border
                  ${isSelected && !isEditMode ? '' : 'border-gray-200 hover:border-gray-400'}`}
                style={{
                  borderColor: isSelected && !isEditMode ? color : undefined,
                  backgroundColor: isSelected && !isEditMode ? `${color}15` : undefined,
                }}
              >
                {isEditMode ? (
                  <button
                    onClick={() => {
                      setCategoryToDelete({ name, color });
                      setShowDeleteModal(true);
                    }}
                  >
                    <Icon
                      path={mdiMinusCircleOutline}
                      size={1}
                      color="#EF4444"
                      className="cursor-pointer"
                    />
                  </button>
                ) : (
                  <Icon path={mdiFolder} size={1} color={color} />
                )}
                <span className="text-sm max-md:text-xs font-medium flex-1 break-all">{name}</span>
              </div>
            );
          })}
        </div>

        {/* 추가 폼 토글 */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-sm text-blue-600 hover:underline mb-4 cursor-pointer flex items-center gap-1"
        >
          <Icon path={mdiPlus} size={1} color="#3B82F6" /> Add Category
        </button>

        {/* 추가 폼 */}
        {showAddForm && (
          <div className="space-y-2 mb-4 border p-4 rounded-lg border-[#B5CC88]">
            <input
              type="text"
              placeholder="Category name"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className="w-full border px-3 py-2 rounded text-sm focus:outline-none transition-all"
              style={{
                borderColor: '#D1D5DB', // 기본 테두리 색상 (Tailwind의 gray-300)
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = newColor;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#D1D5DB';
              }}
            />
            <div className="flex items-center gap-2">
              <label className="text-sm">Color:</label>
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-8 h-8 p-0 rounded"
              />
            </div>
            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="text-sm px-3 py-1 rounded bg-[#4CAF50] text-white hover:bg-[#2E7D32] transition-all"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 text-sm rounded text-white transition-all
              ${selectedCategory ? 'bg-[#D2B48C] hover:bg-[#A67B5B]' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Save
          </button>
        </div>
      </motion.div>
      <DeleteModal
        show={showDeleteModal}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"?`}
        onCancel={() => {
          setShowDeleteModal(false);
          setCategoryToDelete(null);
        }}
        onConfirm={() => {
          if (categoryToDelete) {
            setCategories(prev => prev.filter(c => c.name !== categoryToDelete.name));
            if (selectedCategory === categoryToDelete.name) {
              setSelectedCategory(null);
            }
          }
          setShowDeleteModal(false);
          setCategoryToDelete(null);
        }}
      />
    </div>
  );
};

export default SavePlaceModal;
