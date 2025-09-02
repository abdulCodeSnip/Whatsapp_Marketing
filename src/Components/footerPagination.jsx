import React from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'

const FooterPagination = ({ 
     currentPage = 1, 
     totalPages = 1, 
     onPageChange,
     itemsPerPage = 10,
     totalItems = 0 
}) => {
     
     const getVisiblePages = () => {
          const pages = [];
          const maxVisible = 5;
          
          if (totalPages <= maxVisible) {
               // Show all pages if total is less than max visible
               for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
               }
          } else {
               // Show pages with ellipsis logic
               if (currentPage <= 3) {
                    pages.push(1, 2, 3, 4, '...', totalPages);
               } else if (currentPage >= totalPages - 2) {
                    pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
               } else {
                    pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
               }
          }
          
          return pages;
     };

     const handlePageChange = (page) => {
          if (page !== currentPage && page >= 1 && page <= totalPages && onPageChange) {
               onPageChange(page);
          }
     };

     const startItem = (currentPage - 1) * itemsPerPage + 1;
     const endItem = Math.min(currentPage * itemsPerPage, totalItems);

     return (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
               {/* Results info */}
               <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startItem}</span> to{' '}
                    <span className="font-medium">{endItem}</span> of{' '}
                    <span className="font-medium">{totalItems}</span> results
               </div>

               {/* Pagination controls */}
               <div className="flex flex-row gap-x-1">
                    {/* Previous button */}
                    <button
                         onClick={() => handlePageChange(currentPage - 1)}
                         disabled={currentPage === 1}
                         className={`cursor-pointer border border-gray-200 px-3 py-2 rounded-lg flex flex-row items-center justify-center text-sm gap-x-1 transition-colors ${
                              currentPage === 1 
                                   ? 'text-gray-400 cursor-not-allowed' 
                                   : 'text-gray-600 hover:bg-gray-50'
                         }`}
                    >
                         <MdKeyboardArrowLeft size={16} />
                         <span>Previous</span>
                    </button>

                    {/* Page numbers */}
                    {getVisiblePages().map((page, index) => (
                         <div key={index}>
                              {page === '...' ? (
                                   <div className="px-3 py-2 text-gray-500">...</div>
                              ) : (
                                   <button
                                        onClick={() => handlePageChange(page)}
                                        className={`cursor-pointer border px-3 py-2 rounded-lg flex flex-row items-center justify-center text-sm font-medium transition-colors ${
                                             page === currentPage
                                                  ? 'bg-green-500 text-white border-green-500'
                                                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                   >
                                        {page}
                                   </button>
                              )}
                         </div>
                    ))}

                    {/* Next button */}
                    <button
                         onClick={() => handlePageChange(currentPage + 1)}
                         disabled={currentPage === totalPages}
                         className={`cursor-pointer border border-gray-200 px-3 py-2 rounded-lg flex flex-row items-center justify-center text-sm gap-x-1 transition-colors ${
                              currentPage === totalPages 
                                   ? 'text-gray-400 cursor-not-allowed' 
                                   : 'text-gray-600 hover:bg-gray-50'
                         }`}
                    >
                         <span>Next</span>
                         <MdKeyboardArrowRight size={16} />
                    </button>
               </div>
          </div>
     )
}

export default FooterPagination
