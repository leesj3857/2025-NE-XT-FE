import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
                                                 currentPage,
                                                 totalCount,
                                                 itemsPerPage = 10,
                                                 onPageChange,
                                               }) => {
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex gap-4 justify-center absolute left-1/2 -translate-x-1/2 bottom-4 h-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
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

export default Pagination;