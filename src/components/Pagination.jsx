import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const windowSize = 5; // Number of page buttons to show around the current page

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    let startPage, endPage;
    if (totalPages <= windowSize) {
      // Less than windowSize total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than windowSize total pages so calculate start and end pages
      const maxPagesBeforeCurrentPage = Math.floor(windowSize / 2);
      const maxPagesAfterCurrentPage = Math.ceil(windowSize / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
        // current page near the start
        startPage = 1;
        endPage = windowSize;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        // current page near the end
        startPage = totalPages - windowSize + 1;
        endPage = totalPages;
      } else {
        // current page somewhere in the middle
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const buttonClass = (isActive) => 
    `px-3 py-1.5 mx-1 rounded-lg text-sm font-semibold transition ` +
    (isActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-slate-300');

  const navButtonClass = `px-3 py-1.5 mx-1 rounded-lg text-sm font-semibold bg-white text-slate-600 border border-slate-300 hover:bg-slate-100 transition`;

  return (
    <nav className="flex items-center justify-center space-x-1" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={navButtonClass}
      >
        Previous
      </button>

      {/* Render ellipses if needed at the start */}
      {pageNumbers[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={buttonClass(false)}>1</button>
          {pageNumbers[0] > 2 && <span className="text-slate-500 px-1">...</span>}
        </>
      )}

      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={buttonClass(number === currentPage)}
        >
          {number}
        </button>
      ))}

      {/* Render ellipses if needed at the end */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="text-slate-500 px-1">...</span>}
          <button onClick={() => onPageChange(totalPages)} className={buttonClass(false)}>{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={navButtonClass}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;