import { useState, useEffect, useRef } from 'react';
import { mdiEarth } from '@mdi/js';
import Icon from '@mdi/react';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [language, setLanguage] = useState('한국어');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const selectLanguage = (lang: string) => {
    setLanguage(lang);
    setShowDropdown(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-[#DCE7EB] px-6 py-4 flex items-center justify-between relative">
      <h1 className="text-3xl">KOREAT</h1>

      {/* 언어 선택 아이콘 및 드롭다운 */}
      <div className="relative" ref={dropdownRef}>
        <button onClick={toggleDropdown} className="flex items-center gap-2 cursor-pointer ">
          <Icon path={mdiEarth} size={1} />
          <span className="text-sm">{language}</span>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-300 shadow-md z-10 rounded-md overflow-hidden">
            <button
              onClick={() => selectLanguage('한국어')}
              className="block w-full px-4 py-2 text-left cursor-pointer hover:bg-gray-100">
              한국어
            </button>
            <button
              onClick={() => selectLanguage('English')}
              className="block w-full px-4 py-2 text-left cursor-pointer hover:bg-gray-100">
              English
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;