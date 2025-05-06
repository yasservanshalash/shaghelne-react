import { useLocation } from "react-router-dom";

export default function Pagination1({ currentPage = 1, itemsPerPage = 12, totalItems = 0, paginate }) {
  const { pathname } = useLocation();
  
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Generate page numbers to display
  const generatePageNumbers = () => {
    if (totalPages <= 1) return [1];
    
    const displayedPages = [];
    
    // Always show the first page
    displayedPages.push(1);
    
    // Calculate range to show
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      displayedPages.push('...');
    }
    
    // Add pages in the current range
    for (let i = startPage; i <= endPage; i++) {
      displayedPages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1 && totalPages > 1) {
      displayedPages.push('...');
    }
    
    // Always show the last page if there's more than one page
    if (totalPages > 1 && !displayedPages.includes(totalPages)) {
      displayedPages.push(totalPages);
    }
    
    return displayedPages;
  };

  const handlePageClick = (selectedPage) => {
    if (selectedPage !== currentPage && selectedPage !== '...') {
      paginate(selectedPage);
    }
  };

  // Style objects
  const pageItemStyle = {
    transition: 'all 0.3s ease'
  };
  
  const activeLinkStyle = {
    cursor: 'default',
    backgroundColor: '#5bbb7b',
    borderColor: '#5bbb7b',
    color: 'white'
  };
  
  const disabledLinkStyle = {
    cursor: 'not-allowed',
    color: '#6c757d',
    opacity: 0.5
  };
  
  const hoverableStyle = {
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  // Don't render pagination if there are no pages
  if (totalPages <= 0) return null;

  // Calculate display range
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <>
      <div
        className={`mbp_pagination text-center ${
          pathname === "/blog-2" || pathname === "/blog-3" ? "mb40-md" : ""
        } ${pathname === "/shop-list" ? "mt30" : ""}`}
      >
        <ul className="page_navigation">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <a 
              className="page-link" 
              onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
              style={currentPage > 1 ? hoverableStyle : disabledLinkStyle}
            >
              <span className="fas fa-angle-left" />
            </a>
          </li>
          
          {generatePageNumbers().map((pageNumber, index) => (
            <li 
              key={index} 
              className={`page-item ${pageNumber === currentPage ? 'active' : ''} ${pageNumber === '...' ? 'disabled' : ''}`}
            >
              <a 
                className="page-link"
                onClick={() => handlePageClick(pageNumber)}
                style={
                  pageNumber === '...' ? 
                    disabledLinkStyle : 
                    pageNumber === currentPage ? 
                      activeLinkStyle : 
                      hoverableStyle
                }
              >
                {pageNumber}
                {pageNumber === currentPage && <span className="sr-only">(current)</span>}
              </a>
            </li>
          ))}
          
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <a 
              className="page-link"
              onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}
              style={currentPage < totalPages ? hoverableStyle : disabledLinkStyle}
            >
              <span className="fas fa-angle-right" />
            </a>
          </li>
        </ul>
        <p className="mt10 mb-0 pagination_page_count text-center">
          {totalItems > 0 ? (
            <>
              {startItem} – {endItem} of {totalItems} projects
            </>
          ) : (
            'No projects found'
          )}
        </p>
      </div>
    </>
  );
}
