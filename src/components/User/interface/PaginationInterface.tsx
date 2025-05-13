import React from 'react';

interface PaginationInterfaceProps {
  currentPage: number;
  totalCount: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const PaginationInterface: React.FC<PaginationInterfaceProps> = ({
  currentPage,
  totalCount,
  itemsPerPage = 10,
  onPageChange,
  className = ''
}) => {
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className={`flex gap-2 justify-center items-center ${className}`}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center text-sm ${
            page === currentPage
              ? 'bg-[#2D3433] text-white'
              : 'bg-[#B2BFC2] text-black hover:bg-[#aab2b6]'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default PaginationInterface; 