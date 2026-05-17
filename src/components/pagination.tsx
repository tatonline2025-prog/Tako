type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="text-gray-600">
        Trang <span className="font-semibold">{currentPage}</span> trên <span className="font-semibold">{totalPages}</span>
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="rounded-lg border border-gray-300 px-3 py-2 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Trước
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="rounded-lg border border-gray-300 px-3 py-2 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau →
        </button>
      </div>
    </div>
  );
}
