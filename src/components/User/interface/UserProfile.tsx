// src/components/User/interface/UserProfile.tsx
import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiAccountCircle } from '@mdi/js';
import { AnimatePresence, motion } from 'framer-motion';

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
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Account</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDeleteAccount();
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
