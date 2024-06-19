import React from 'react';


const Pagination = ({ currentPage, totalPages, handlePageClick }) => {
  const getDisplayNumbers = () => {
    const displayNumbers = [];
    const maxButtons = 4; // Maximum number of buttons to display
    const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (totalPages <= maxButtons) {
      // If total pages are less than or equal to maxButtons, display all page numbers
      for (let i = 1; i <= totalPages; i++) {
        displayNumbers.push(i);
      }
    } else {
      // Display first page, page 2, and dots if currentPage is greater than 2
      if (startPage > 1) displayNumbers.push(1);
      if (startPage > 2) displayNumbers.push('...');

      // Display pages around the current page
      for (let i = startPage; i <= endPage; i++) {
        displayNumbers.push(i);
      }

      // Display dots and last page if necessary
      if (endPage < totalPages - 1) displayNumbers.push('...');
      if (endPage < totalPages) displayNumbers.push(totalPages);
    }

    return displayNumbers;
  };

  const numbers = getDisplayNumbers();

  return (
    <ul className='pagination'>
      {numbers.map(number => (
        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
          {typeof number === 'number' ? (
            <button onClick={() => handlePageClick(number)} className='page-link'>
              {number}
            </button>
          ) : (
            <span className='dots'>{number}</span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Pagination;
