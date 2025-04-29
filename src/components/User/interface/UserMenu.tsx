// src/components/UserMenu.tsx
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../store/slices/userSlice.ts';
import { RootState } from '../../../store';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@mdi/react';
import { mdiLogout, mdiAccountCircle, mdiAccountDetails } from '@mdi/js';
import {useNavigate} from "react-router-dom";

const UserMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useSelector((state: RootState) => state.user.name);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?\nYou will be redirected to the home page if you confirm.');
    if (confirmed) {
      dispatch(logout());
      localStorage.removeItem('user');
      navigate('/');
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center px-3 py-1 md:py-2 bg-white border rounded-full text-sm max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap hover:bg-gray-100 transition duration-150 shadow-sm cursor-pointer"
      >
        <Icon path={mdiAccountCircle} size={0.9} className="mr-1 md:mr-2 text-gray-700" />
        <span className="truncate">{userName}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-1 w-fit bg-white border rounded-md shadow-lg z-10"
          >
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center cursor-pointer rounded-t-md whitespace-nowrap"
              onClick={() => {
                navigate('/mypage');
                setOpen(false);
              }}
            >
              <Icon path={mdiAccountDetails} size={0.85} className="mr-2 text-gray-600" />
              My Page
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center text-red-500 cursor-pointer rounded-b-md"
              onClick={handleLogout}
            >
              <Icon path={mdiLogout} size={0.85} className="mr-2" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
