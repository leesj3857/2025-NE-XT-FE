// src/components/User/interface/CategorySectionMobile.tsx
import { useState, useEffect } from 'react';
import Icon from '@mdi/react';
import {
  mdiChevronLeft,
  mdiFolderOutline,
  mdiMap,
  mdiDeleteOutline,
  mdiPencilOutline,
  mdiPlus,
  mdiCloseCircle,
  mdiCommentTextMultipleOutline,
} from '@mdi/js';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceItemType } from "../../../types/place/type.ts";
import DeleteModal from '../../../interface/DeleteModal.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAppDispatch } from '../../../store/hooks';
import {
  deleteSavedPlace,
  deleteUserCategory,
  createUserCategory,
  updateUserCategory,
} from '../utils/API.ts';
import { fetchAndStoreUserCategories } from '../../../store/thunks/fetchcategories';
import PaginationInterface from './PaginationInterface.tsx';

const CategorySectionMobile = ({ 
  handleCategoryClick,
  handleReviewClick 
}: { 
  handleCategoryClick: (categoryId: string) => void;
  handleReviewClick: (place: PlaceItemType) => void;
}) => {
  const { categories, accessToken } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [newCategoryForm, setNewCategoryForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#F59E0B');
  const [errorMessage, setErrorMessage] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [placeToDelete, setPlaceToDelete] = useState<{ categoryId: string, placeId: string, placeName: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleAddCategory = async () => {
    if (!accessToken || !newName.trim()) return;
    try {
      await createUserCategory(newName.trim(), newColor, accessToken);
      dispatch(fetchAndStoreUserCategories());
      setNewName('');
      setNewColor('#F59E0B');
      setNewCategoryForm(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create category');
    }
  };

  const handleCategoryRename = async (categoryId: string, oldName: string, newName: string) => {
      if (!accessToken) return;
      if (newName === oldName) {
        setEditingCategoryId(null);
        return;
      }
      const original = categories.find(cat => cat.id === categoryId);
      if (!original) return;
      try {
      await updateUserCategory(categoryId, newName, original.color, accessToken);
      dispatch(fetchAndStoreUserCategories());
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setEditingCategoryId(null);
    }
  };
  const handleRequestDeletePlace = (categoryId: string, placeId: string | undefined, placeName: string) => {
    if(placeId) {
      setPlaceToDelete({ categoryId, placeId, placeName: placeName });
      setShowDeleteModal(true);
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

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const selectedPlaces = selectedCategory?.places || [];
  const currentPlaces = selectedPlaces.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 페이지 변경 시 스크롤 초기화
  useEffect(() => {
    if (selectedCategoryId) {
      const container = document.querySelector('.places-container');
      if (container) {
        container.scrollTop = 0;
      }
    }
  }, [currentPage, selectedCategoryId]);

  const handleReviewClickWrapper = (place: PlaceItemType) => {
    setSelectedCategoryId(null); // 리뷰쓰기 클릭 시 카테고리 선택 상태 초기화
    handleReviewClick(place);
  };

  return (
    <div className="relative w-full overflow-hidden p-2">
      <DeleteModal
        show={showDeleteModal}
        title="Delete Confirmation"
        message={placeToDelete ? `Are you sure you want to delete ${placeToDelete.placeName}?` : `Are you sure you want to delete ${categoryToDelete?.name}?`}
        onCancel={() => {
          setShowDeleteModal(false);
          setPlaceToDelete(null);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

      <AnimatePresence mode="wait">
        {!selectedCategoryId ? (
          <motion.div
            key="categories" 
            initial={{ x: '-110%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-110%', opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 gap-4 px-1">
              {categories.map(({ id, name, color }) => {
                const isEditing = editingCategoryId === id;
                return (
                  <div
                    key={id}
                    className="relative flex flex-col items-center justify-center rounded-xl cursor-pointer bg-white shadow-md hover:shadow-lg transition border border-gray-200 w-full aspect-square p-4 space-y-2"
                  >
                    <div className="absolute top-2 w-5/6 flex gap-1 justify-between">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCategoryId(id);
                          setEditedName(name);
                        }}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <Icon path={mdiPencilOutline} size={0.9} className="text-gray-500 hover:text-gray-800" />
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setCategoryToDelete({ id, name });
                          setShowDeleteModal(true);
                        }}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <Icon path={mdiDeleteOutline} size={0.9} className="text-red-500 hover:text-red-700" />
                      </div>
                    </div>
                    <button onClick={() => !isEditing && setSelectedCategoryId(id)}>
                      <Icon path={mdiFolderOutline} size={2.5} style={{ color }} />
                    </button>
                    {isEditing ? (
                      <input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onBlur={() => handleCategoryRename(id, name, editedName)}
                        className="text-xs border p-1 rounded w-full text-center bg-white"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm font-medium text-[#1A1E1D] text-center break-words truncate">{name}</span>
                    )}
                  </div>
                );
              })}
            {categories.length === 0 && <p className="text-sm text-gray-500 col-span-2">There are no saved categories.</p>}
          </motion.div>
        ) : (
          <motion.div
            key="places"  
            initial={{ x: '110%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '110%', opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4">
            <button onClick={() => {
              setSelectedCategoryId(null);
              setCurrentPage(1);
            }} className="flex items-center text-base text-[#0096C7] w-fit">
              <Icon path={mdiChevronLeft} size={1} /> Back
            </button>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-semibold">{selectedCategory?.name}</h3>
              <button 
                onClick={() => selectedCategory && handleCategoryClick(selectedCategory.id)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                title="View on Map"
              >
                <Icon path={mdiMap} size={1.3} className="text-[#2E7D32]" />
              </button>
            </div>
            <div className="places-container flex flex-col gap-4">
              {selectedPlaces.length === 0 ? (
                <p className="text-sm text-gray-500">There are no saved places.</p>
              ) : (
                currentPlaces.map((place) => (
                  <div key={place.id} className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition flex justify-between items-center">
                    <p className="font-medium text-[#1A1E1D]">{place.placeName}</p>
                    <div className="ml-2 flex gap-2 items-center">
                      <button 
                        onClick={() => handleReviewClickWrapper(place)}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        title="Write Review"
                      >
                        <Icon path={mdiCommentTextMultipleOutline} size={0.8} className="text-blue-600" />
                      </button>
                      <button 
                        onClick={() => handleRequestDeletePlace(selectedCategory!.id, place.dataId, place.placeName)}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        title="Delete Place"
                      >
                        <Icon path={mdiCloseCircle} size={1} className="text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {selectedPlaces.length > 0 && (
              <div className="mt-0">
                <PaginationInterface
                  currentPage={currentPage}
                  totalCount={selectedPlaces.length}
                  itemsPerPage={pageSize}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 카테고리 추가 폼 */}
      {newCategoryForm ? (
        <div className="mt-4 p-3 rounded-xl space-y-2">
          <input
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="Category name"
            className="text-sm border p-1 rounded w-full focus:outline-none transition-all"
            style={{
              borderColor: newColor || '#D1D5DB', // 기본 테두리 색상 (Tailwind의 gray-300)
            }}
          />
          <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={handleAddCategory} className="text-sm bg-green-500 text-white px-3 py-1 rounded">Add</button>
            <button onClick={() => setNewCategoryForm(false)} className="text-sm text-gray-600 px-2">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setNewCategoryForm(true)} className="text-sm text-blue-600 mt-4 hover:underline flex items-center gap-1">
          <Icon path={mdiPlus} size={1} /> Add Category
        </button>
      )}
    </div>
  );
};

export default CategorySectionMobile;
