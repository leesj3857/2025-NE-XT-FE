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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async () => {
    if (!newName) return; // 빈 문자열은 막음

    // 이전과 동일하면 API 호출 없이 종료
    if (newName === name) {
      setEditMode(false);
      return;
    }

    try {
      setLoading(true);
      await onChangeName(newName); // 공백 포함 그대로 전달
      setLoading(false);
      setEditMode(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unknown error occurred');
      }
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
              <div className="flex max-md:flex-col gap-2 items-end w-full">
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
