import { useState, useRef, useEffect } from 'react';
import { Icon } from '@mdi/react';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';

interface Option {
    value: string;
    label: string;
}

interface CustomDropdownProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const CustomDropdown = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    className = '',
}: CustomDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 border border-[#CBCCCC] rounded flex justify-between items-center bg-white hover:border-[#2D3433] transition-all"
            >
                <span className="text-left truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <Icon
                    path={isOpen ? mdiChevronUp : mdiChevronDown}
                    size={1}
                    className="text-gray-500 flex-shrink-0"
                />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#CBCCCC] rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors ${option.value === value ? 'bg-gray-50 text-[#2D3433]' : 'text-gray-700'
                                } ${option.value === '' ? 'text-gray-500' : ''}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown; 