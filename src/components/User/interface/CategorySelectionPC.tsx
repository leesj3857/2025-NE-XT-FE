import { useState } from 'react';
import Icon from '@mdi/react';
import {
  mdiFolderOutline,
  mdiMap,
  mdiDeleteOutline,
  mdiPencilOutline,
  mdiCloseCircle,
  mdiPlus,
  mdiCommentTextMultipleOutline,
} from '@mdi/js';
import DeleteModal from '../../../interface/DeleteModal.tsx';
import { PlaceItemType } from "../../../types/place/type.ts";
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { fetchAndStoreUserCategories } from '../../../store/thunks/fetchcategories';
import { useAppDispatch } from '../../../store/hooks';
import {
  createUserCategory,
  deleteUserCategory,
  deleteSavedPlace,
  updateUserCategory,
} from '../utils/API';

interface CategorySectionPCProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  handleCategoryClick: (categoryId: string) => void;
  handleReviewClick: (place: PlaceItemType) => void;
}

const CategorySectionPC = ({
  selectedCategory,
  onSelectCategory,
  handleCategoryClick,
  handleReviewClick,
}: CategorySectionPCProps) => {
  const dispatch = useAppDispatch();
  const { accessToken, categories } = useSelector((state: RootState) => state.user);

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [newCategoryForm, setNewCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newColor, setNewColor] = useState('#F59E0B');
  const [errorMessage, setErrorMessage] = useState('');

  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [placeToDelete, setPlaceToDelete] = useState<{ categoryId: string, placeId: string, placeName: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const selectedPlaces = categories.find(cat => cat.id === selectedCategory)?.places || [];

 const handleStartEditCategory = (categoryId: string, currentName: string) => {
    setEditingCategoryId(categoryId);
    setEditedName(currentName);
  };

  const handleRequestDeleteCategory = (categoryId: string, categoryName: string) => {
    setCategoryToDelete({ id: categoryId, name: categoryName });
    setShowDeleteModal(true);
  };

  const handleRequestDeletePlace = (categoryId: string, placeId: string | undefined, placeName: string) => {
    if(placeId) {
      setPlaceToDelete({ categoryId, placeId, placeName: placeName });
      setShowDeleteModal(true);
    }
  };

  const handleCategoryRename = async (categoryId: string, oldName: string, newName: string) => {
    if (!accessToken) return;
    if (newName === oldName) {
      setEditingCategoryId(null);
      return;
    }
    const original = categories.find(cat => cat.id === categoryId);
    if (!original) return; // 해당 카테고리가 없으면 중단
  
    try {
      await updateUserCategory(categoryId, newName, original.color, accessToken);
      dispatch(fetchAndStoreUserCategories());
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setEditingCategoryId(null);
    }
  };

   const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setErrorMessage('Please enter a category name.');
      return;
    }
    if (!accessToken) return;

    try {
      await createUserCategory(newCategory, newColor, accessToken);
      dispatch(fetchAndStoreUserCategories());
      setNewCategory('');
      setNewColor('#F59E0B');
      setNewCategoryForm(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create category');
    }
  };


  const handleDeleteConfirm = async () => {
    try {
      if (placeToDelete && accessToken) {
        await deleteSavedPlace(placeToDelete.placeId, accessToken);
      } else if (categoryToDelete && accessToken) {
        await deleteUserCategory(categoryToDelete.id, accessToken);
      }
      dispatch(fetchAndStoreUserCategories());
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setShowDeleteModal(false);
      setPlaceToDelete(null);
      setCategoryToDelete(null);
    }
  };

  return (
   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-[#1A1E1D] mb-5 h-10 flex items-center">Categories</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-center">
          {categories.map(({ id, name, color }) => {
            const isSelected = selectedCategory === id;
            const isEditing = editingCategoryId === id;

            return (
              <div
                key={id}
                onClick={() => !isEditing && onSelectCategory(id)}
                className={`group relative flex flex-col items-center justify-center rounded-lg cursor-pointer border border-transparent transition duration-200 w-[120px] aspect-square p-4 ${
                  isSelected ? 'bg-opacity-20' : 'hover:bg-gray-100'
                }`}
                style={{ backgroundColor: isSelected ? `${color}15` : undefined }}
              >
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); handleStartEditCategory(id, name); }} title="Rename">
                    <Icon path={mdiPencilOutline} size={0.9} className="text-gray-600 hover:text-gray-800 transition-all" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleRequestDeleteCategory(id, name); }} title="Delete">
                    <Icon path={mdiDeleteOutline} size={0.9} className="text-red-500 hover:text-red-700 transition-all" />
                  </button>
                </div>
                <Icon path={mdiFolderOutline} size={2.5} style={{ color }} className="mb-2 mt-2" />
                {isEditing ? (
                  <input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onBlur={() => handleCategoryRename(id, name, editedName)}
                    className="text-xs p-1 border rounded w-full text-center bg-white"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm font-medium text-[#1A1E1D] text-center break-words">{name}</span>
                )}
              </div>
            );
          })}
        </div>
        {categories.length === 0 && (
          <p className="text-base text-gray-500 margin-0">There are no saved categories.</p>
        )}
        {/* 카테고리 추가 폼 */}
        <div className="mt-6">
          {newCategoryForm ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <input
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Category name"
                  className="text-sm border p-1 rounded focus:outline-none transition-all"
                  style={{
                    borderColor: newColor || '#D1D5DB', // 기본 테두리 색상 (Tailwind의 gray-300)
                  }}
                />
                <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
              </div>
              {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
              <div className="flex gap-2">
                <button onClick={handleAddCategory} className="text-sm px-3 py-1 rounded bg-[#4CAF50] text-white hover:bg-[#2E7D32] transition-all">Add</button>
                <button onClick={() => setNewCategoryForm(false)} className="text-sm text-gray-500 px-2 py-1 hover:text-gray-700 transition-all">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setNewCategoryForm(true)} className="text-sm text-blue-600 hover:underline mt-4 flex items-center gap-1">
              <Icon path={mdiPlus} size={1} /> Add Category
            </button>
          )}
        </div>
      </div>

      {/* Places */}
      <div>
        <h3 className="text-lg font-semibold text-[#1A1E1D] mb-5 flex justify-between items-center h-10">
          {selectedCategory ? 'Saved Places' : 'Select a category'}
          {selectedCategory && (
            <button 
              onClick={() => handleCategoryClick(selectedCategory)}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              title="View on Map"
            >
              <Icon path={mdiMap} size={1.5} className="text-[#2E7D32]" />
            </button>
          )}
        </h3>
        {selectedCategory && (
          <>
            {selectedPlaces.length === 0 ? (
              <p className="text-base text-gray-500">There are no saved places.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {selectedPlaces.map((place: PlaceItemType) => (
                  <div key={place.id} className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition flex justify-between items-center">
                    <p className="font-medium text-[#1A1E1D]">{place.placeName}</p>
                    <div className="flex gap-2 items-center">
                      <button 
                        onClick={() => handleReviewClick(place)}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        title="Write Review"
                      >
                        <Icon path={mdiCommentTextMultipleOutline} size={1} className="text-blue-600" />
                      </button>
                      <button 
                        onClick={() => handleRequestDeletePlace(selectedCategory, place.dataId, place.placeName)}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        title="Delete Place"
                      >
                        <Icon path={mdiCloseCircle} size={1} className="text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <DeleteModal
        show={showDeleteModal}
        title="Delete Confirmation"
        message={
          placeToDelete
            ? `Are you sure you want to delete ${placeToDelete.placeName}?`
            : `Are you sure you want to delete ${categoryToDelete?.name}?`
        }
        onCancel={() => {
          setShowDeleteModal(false);
          setPlaceToDelete(null);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default CategorySectionPC;