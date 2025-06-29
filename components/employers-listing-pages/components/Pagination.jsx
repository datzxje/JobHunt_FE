const Pagination = ({ 
  currentPage = 0, 
  totalPages = 1, 
  onPageChange = () => {}, 
  loading = false 
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(0, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 0) {
      if (range[0] > 1) {
        rangeWithDots.push(0, '...');
      } else {
        rangeWithDots.push(0);
      }
    }

    rangeWithDots.push(...range);

    if (range[range.length - 1] < totalPages - 1) {
      if (range[range.length - 1] < totalPages - 2) {
        rangeWithDots.push('...', totalPages - 1);
      } else {
        rangeWithDots.push(totalPages - 1);
      }
    }

    return rangeWithDots;
  };

  const handlePageChange = (page) => {
    if (loading || page < 0 || page >= totalPages || page === currentPage) {
      return;
    }
    onPageChange(page);
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if only 1 page
  }

  return (
    <nav className="ls-pagination">
      <ul>
        <li className={`prev ${currentPage === 0 || loading ? 'disabled' : ''}`}>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            style={{ 
              opacity: currentPage === 0 || loading ? 0.5 : 1,
              cursor: currentPage === 0 || loading ? 'not-allowed' : 'pointer'
            }}
          >
            <i className="fa fa-arrow-left"></i>
          </a>
        </li>
        
        {getPageNumbers().map((pageNum, index) => (
          <li key={index}>
            {pageNum === '...' ? (
              <span className="dots" style={{ padding: '5px 10px', color: '#999' }}>...</span>
            ) : (
              <a 
                href="#"
                className={pageNum === currentPage ? 'current-page' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pageNum);
                }}
                style={{ 
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {pageNum + 1}
              </a>
            )}
          </li>
        ))}
        
        <li className={`next ${currentPage === totalPages - 1 || loading ? 'disabled' : ''}`}>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            style={{ 
              opacity: currentPage === totalPages - 1 || loading ? 0.5 : 1,
              cursor: currentPage === totalPages - 1 || loading ? 'not-allowed' : 'pointer'
            }}
          >
            <i className="fa fa-arrow-right"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
