interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getVisiblePages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, 4);
      }

      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3);
      }

      if (start > 2) {
        pages.push('ellipsis');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const navButtonStyle = {
    background: 'linear-gradient(180deg, #f5f5f4 0%, #e7e5e4 100%)',
    boxShadow: '0 3px 0 #a8a29e',
    borderRadius: '6px'
  };

  const activePageStyle = {
    background: 'linear-gradient(180deg, #4ecdc4 0%, #2d8f8f 100%)',
    color: 'white',
    boxShadow: '0 3px 0 #1a5f5f',
    borderRadius: '6px'
  };

  const inactivePageStyle = {
    background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f4 100%)',
    color: '#78716c',
    boxShadow: '0 2px 0 #d6d3d1',
    borderRadius: '6px'
  };

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center font-black transition-all hover:translate-y-0.5 active:translate-y-1 disabled:opacity-40 disabled:hover:translate-y-0"
        style={navButtonStyle}
        aria-label="Previous page"
      >
        {'<'}
      </button>

      {/* Page numbers */}
      {visiblePages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="w-10 h-10 flex items-center justify-center font-mono font-black text-stone-400"
            >
              ...
            </span>
          );
        }

        const isCurrentPage = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isCurrentPage}
            className="w-10 h-10 flex items-center justify-center font-mono font-black transition-all hover:translate-y-0.5 active:translate-y-1 disabled:hover:translate-y-0"
            style={isCurrentPage ? activePageStyle : inactivePageStyle}
            aria-current={isCurrentPage ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center font-black transition-all hover:translate-y-0.5 active:translate-y-1 disabled:opacity-40 disabled:hover:translate-y-0"
        style={navButtonStyle}
        aria-label="Next page"
      >
        {'>'}
      </button>
    </nav>
  );
}
