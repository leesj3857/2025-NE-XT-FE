// src/components/User/interface/UserProfile.tsx
import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiAccountCircle } from '@mdi/js';
import { AnimatePresence, motion } from 'framer-motion';
import DeleteModal from '../../../interface/DeleteModal';

interface UserProfileProps {
  name: string | null;
  email: string | null;
  onChangeName: (newName: string) => Promise<void>;
  isDeleting: boolean;
  handleDeleteAccount: () => void;
}

const UserProfile = ({ name, email, onChangeName, isDeleting, handleDeleteAccount }: UserProfileProps) => {
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(name || '');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      setErrorMessage('이름은 공백만으로 구성될 수 없습니다.');
      return;
    }

    if (trimmedName === name) {
      setEditMode(false);
      return;
    }

    try {
      setLoading(true);
      await onChangeName(trimmedName);
      setEditMode(false);
      setErrorMessage('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative flex items-center border border-gray-300 gap-6 p-6 rounded-xl shadow-lg bg-gradient-to-r from-[#FAFAFA] to-white">
      <DeleteModal
        show={showDeleteConfirm}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          handleDeleteAccount();
          setShowDeleteConfirm(false);
        }}
      />
      
      <Icon
        path={mdiAccountCircle}
        size={3}
        className={`text-blue-500 
                    ${editMode ? 'hidden md:block' : 'block'}
                  `}
      />
      <div className="flex-1">
        <p className="text-xl font-semibold text-[#1A1E1D]">{name}</p>
        <p className="text-sm text-[#1A1E1D]">{email}</p>

        {!editMode && (
          <button
            className="mt-2 text-sm text-[#0096C7] hover:underline cursor-pointer"
            onClick={() => setEditMode(true)}
          >
            Change Name
          </button>
        )}

        {editMode && (
          <div className="mt-3 flex items-center gap-1">
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#0096C7] border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="flex flex-col w-full">
                <div className="flex gap-2 items-end max-md:flex-col">
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 max-md:w-full"
                  />
                  <button
                    onClick={handleSubmit}
                    className="px-3 py-1 bg-[#0096C7] text-white text-sm rounded hover:bg-[#1ABC9C] transition cursor-pointer w-fit"
                  >
                    Confirm
                  </button>
                </div>
                {errorMessage && (
                  <p className="text-xs text-red-600 mt-2">{errorMessage}</p>
                )}
              </div>
            )}
          </div>
        )}
        {/* 삭제 버튼 */}
        <div className="flex mt-4">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="text-red-500 hover:underline text-sm cursor-pointer flex items-center gap-2"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Delete Account'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
