import React from "react";

const Pagination = ({ 
  currentPage = 0, 
  totalPages = 0, 
  onPageChange = () => {} 
}) => {
  // Convert 0-based to 1-based for display
  const displayCurrentPage = currentPage + 1;
  const displayTotalPages = totalPages;

  const handlePrevClick = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    console.log(`📄 Pagination click: page ${page} (display) -> ${page - 1} (0-based)`);
    onPageChange(page - 1); // Convert back to 0-based
  };

  const renderPaginationItems = () => {
    if (displayTotalPages <= 0) return null;

    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, displayCurrentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(displayTotalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      items.push(
        <li key={1}>
          <span 
            className={displayCurrentPage === 1 ? "current-page" : ""} 
            onClick={() => handlePageClick(1)}
          >
            1
          </span>
        </li>
      );
      
      if (startPage > 2) {
        items.push(
          <li key="start-ellipsis">
            <span>...</span>
          </li>
        );
      }
    }

    // Add visible page numbers
    for (let page = startPage; page <= endPage; page++) {
      const isCurrentPage = page === displayCurrentPage;
      const className = isCurrentPage ? "current-page" : "";

      items.push(
        <li key={page}>
          <span className={className} onClick={() => handlePageClick(page)}>
            {page}
          </span>
        </li>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < displayTotalPages) {
      if (endPage < displayTotalPages - 1) {
        items.push(
          <li key="end-ellipsis">
            <span>...</span>
          </li>
        );
      }
      
      items.push(
        <li key={displayTotalPages}>
          <span 
            className={displayCurrentPage === displayTotalPages ? "current-page" : ""} 
            onClick={() => handlePageClick(displayTotalPages)}
          >
            {displayTotalPages}
          </span>
        </li>
      );
    }

    return items;
  };

  // Don't render pagination if no pages
  if (displayTotalPages <= 0) {
    return null;
  }

  return (
    <nav className="ls-pagination">
      <ul>
        <li className={`prev ${currentPage <= 0 ? 'disabled' : ''}`}>
          <span 
            onClick={handlePrevClick}
            style={{ 
              cursor: currentPage <= 0 ? 'not-allowed' : 'pointer',
              opacity: currentPage <= 0 ? 0.5 : 1 
            }}
          >
            <i className="fa fa-arrow-left"></i>
          </span>
        </li>
        {renderPaginationItems()}
        <li className={`next ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
          <span 
            onClick={handleNextClick}
            style={{ 
              cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage >= totalPages - 1 ? 0.5 : 1 
            }}
          >
            <i className="fa fa-arrow-right"></i>
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
