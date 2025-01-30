// src/components/Pagination.tsx
"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages === 0) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center space-x-2 mt-4">
      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 border rounded ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 hover:bg-blue-100"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
