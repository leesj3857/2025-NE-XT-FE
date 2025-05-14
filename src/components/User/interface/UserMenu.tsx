import { useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/userSlice.ts';
import Icon from '@mdi/react';
import { mdiLogout, mdiAccountDetails } from '@mdi/js';
import { useNavigate } from "react-router-dom";
import DeleteModal from '../../../interface/DeleteModal';
import { useState } from 'react';

const UserMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="px-3 py-1 md:py-2 bg-white border rounded-full text-sm hover:bg-gray-100 transition duration-150 shadow-sm flex items-center"
        onClick={() => navigate('/mypage')}
      >
        <Icon path={mdiAccountDetails} size={0.85} className="mr-1 md:mr-2 text-gray-600" />
        My Page
      </button>

      <button
        className="px-3 py-1 md:py-2 bg-white border rounded-full text-sm hover:bg-gray-100 transition duration-150 shadow-sm flex items-center text-red-500"
        onClick={() => setShowLogoutModal(true)}
      >
        <Icon path={mdiLogout} size={0.85} className="mr-1 md:mr-2" />
        Logout
      </button>

      <DeleteModal
        show={showLogoutModal}
        title="Logout Confirmation"
        message="Are you sure you want to log out? You will be redirected to the home page if you confirm."
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          handleLogout();
        }}
        cancelText="Cancel"
        confirmText="Logout"
      />
    </div>
  );
};

export default UserMenu;
