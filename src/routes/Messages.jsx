import React, { useEffect, useState, useRef, useCallback } from 'react'
import { RiCheckDoubleLine, RiSendPlaneLine } from "react-icons/ri";
import { CiSearch, CiCalendar } from "react-icons/ci";
import { Link, useLocation } from 'react-router-dom';
import CustomInput from '../Components/customInput';
import FilterButton from '../Components/filterButton';
import FilterCard from '../Components/filterCard';
import { HiSortDescending } from 'react-icons/hi';
import SideBar from '../Components/SideBar';
import Header from '../Components/ContactsManagementPage/Header';
import FooterPagination from '../Components/footerPagination';
import AllMessagesTable from '../Components/Messages/AllMessagesTable';
import useFetchMessages from '../hooks/useFetchMessages';
import Spinner from '../Components/Spinner';


const Messages = () => {

     const [searchMessages, setSearchMessages] = useState("");
     const [showDateFilterDialog, setShowDateFilterDialog] = useState(false);
     const [showSortByFilterDialog, setShowSortByFilterDialog] = useState(false);
     const [showStatusFilterDialog, setShowStatusFilterDialog] = useState(false);
     const [isFilterLoading, setIsFilterLoading] = useState(false);
     const [isSearching, setIsSearching] = useState(false);

     // Filter states
     const [dateFilter, setDateFilter] = useState({
          startDate: '',
          endDate: ''
     });
     const [statusFilter, setStatusFilter] = useState({
          all: true,
          delivered: false,
          pending: false,
          read: false
     });
     const [sortBy, setSortBy] = useState('byNewestDate'); // Default sort

     // Refs for dropdown containers
     const dateFilterRef = useRef(null);
     const statusFilterRef = useRef(null);
     const sortByFilterRef = useRef(null);

     // Get messages for search count
     const { messages, currentUser, isLoading, isError, retryFetch } = useFetchMessages(20);

     // Debounced search function
     const debouncedSearch = useCallback((searchTerm) => {
          setIsSearching(true);
          const timeoutId = setTimeout(() => {
               setIsSearching(false);
          }, 500);
          return () => clearTimeout(timeoutId);
     }, []);

     // Handle search input change
     const handleSearchChange = (e) => {
          const value = e.target.value;
          setSearchMessages(value);
          if (value.trim()) {
               debouncedSearch(value);
          } else {
               setIsSearching(false);
          }
     };

     // Apply date filter
     const applyDateFilter = async (startDate, endDate) => {
          setIsFilterLoading(true);
          // Simulate small delay for filter processing
          setTimeout(() => {
               setDateFilter({ startDate, endDate });
               setShowDateFilterDialog(false);
               setIsFilterLoading(false);
          }, 300);
     };

     // Apply status filter
     const applyStatusFilter = async (statusType, checked) => {
          setIsFilterLoading(true);
          // Simulate small delay for filter processing
          setTimeout(() => {
               if (statusType === 'all') {
                    setStatusFilter({
                         all: checked,
                         delivered: false,
                         pending: false,
                         read: false
                    });
               } else {
                    setStatusFilter(prev => ({
                         ...prev,
                         all: false,
                         [statusType]: checked
                    }));
               }
               setIsFilterLoading(false);
          }, 300);
     };

     // Apply sort filter
     const applySortFilter = async (sortType) => {
          setIsFilterLoading(true);
          // Simulate small delay for filter processing
          setTimeout(() => {
               setSortBy(sortType);
               setShowSortByFilterDialog(false);
               setIsFilterLoading(false);
          }, 300);
     };

     // Clear all filters
     const clearAllFilters = () => {
          setSearchMessages("");
          setDateFilter({ startDate: '', endDate: '' });
          setStatusFilter({ all: true, delivered: false, pending: false, read: false });
          setSortBy('byNewestDate');
     };

     // Check if any filters are active
     const hasActiveFilters = () => {
          return searchMessages.trim() || 
                 dateFilter.startDate || 
                 dateFilter.endDate || 
                 !statusFilter.all || 
                 sortBy !== 'byNewestDate';
     };

     // Calculate filtered messages count for display
     const getFilteredCount = () => {
          if (!searchMessages.trim() && !dateFilter.startDate && !dateFilter.endDate && statusFilter.all && sortBy === 'byNewestDate') {
               return messages?.length || 0;
          }

          return getFilteredAndSortedMessages().length;
     };

     // Get filtered and sorted messages
     const getFilteredAndSortedMessages = () => {
          let filtered = messages || [];

          // Apply search filter
          if (searchMessages.trim()) {
               const query = searchMessages.toLowerCase().trim();
               filtered = filtered.filter(userMsg => {
                    const contactName = (currentUser?.user?.first_name + " " + currentUser?.user?.last_name).toLowerCase();
                    const contactPhone = currentUser?.user?.phone?.toLowerCase() || "";
                    const messageText = userMsg?.chat?.at(userMsg?.chat?.length - 1)?.content?.toLowerCase() || "";
                    const messageStatus = userMsg?.chat?.at(userMsg?.chat?.length - 1)?.status?.toLowerCase() || "";

                    return (
                         contactName.includes(query) ||
                         contactPhone.includes(query) ||
                         messageText.includes(query) ||
                         messageStatus.includes(query)
                    );
               });
          }

          // Apply date filter
          if (dateFilter.startDate || dateFilter.endDate) {
               filtered = filtered.filter(userMsg => {
                    const messageDate = userMsg?.chat?.at(userMsg?.chat?.length - 1)?.updated_at?.split("T")?.at(0);
                    if (!messageDate) return false;

                    const msgDate = new Date(messageDate);
                    const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
                    const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

                    if (startDate && endDate) {
                         return msgDate >= startDate && msgDate <= endDate;
                    } else if (startDate) {
                         return msgDate >= startDate;
                    } else if (endDate) {
                         return msgDate <= endDate;
                    }
                    return true;
               });
          }

          // Apply status filter
          if (!statusFilter.all) {
               filtered = filtered.filter(userMsg => {
                    const messageStatus = userMsg?.chat?.at(userMsg?.chat?.length - 1)?.status?.toLowerCase() || "";
                    
                    return (
                         (statusFilter.delivered && messageStatus === 'delivered') ||
                         (statusFilter.pending && messageStatus === 'pending') ||
                         (statusFilter.read && messageStatus === 'read')
                    );
               });
          }

          // Apply sorting
          filtered.sort((a, b) => {
               const aDate = new Date(a?.chat?.at(a?.chat?.length - 1)?.updated_at || 0);
               const bDate = new Date(b?.chat?.at(b?.chat?.length - 1)?.updated_at || 0);
               const aContactName = currentUser?.user?.first_name + " " + currentUser?.user?.last_name;
               const bContactName = currentUser?.user?.first_name + " " + currentUser?.user?.last_name;
               const aStatus = a?.chat?.at(a?.chat?.length - 1)?.status || "";
               const bStatus = b?.chat?.at(b?.chat?.length - 1)?.status || "";

               switch (sortBy) {
                    case 'byNewestDate':
                         return bDate - aDate;
                    case 'byOldestDate':
                         return aDate - bDate;
                    case 'byStatus':
                         return aStatus.localeCompare(bStatus);
                    case 'byContactNameAsc':
                         return aContactName.localeCompare(bContactName);
                    default:
                         return bDate - aDate;
               }
          });

          return filtered;
     };

     const filteredCount = getFilteredCount();
     const totalCount = messages?.length || 0;

     // Handle outside click to close dropdowns
     useEffect(() => {
          const handleClickOutside = (event) => {
               // Check if click is outside date filter
               if (dateFilterRef.current && !dateFilterRef.current.contains(event.target)) {
                    setShowDateFilterDialog(false);
               }
               // Check if click is outside status filter
               if (statusFilterRef.current && !statusFilterRef.current.contains(event.target)) {
                    setShowStatusFilterDialog(false);
               }
               // Check if click is outside sort by filter
               if (sortByFilterRef.current && !sortByFilterRef.current.contains(event.target)) {
                    setShowSortByFilterDialog(false);
               }
          };

          // Add event listener when any dropdown is open
          if (showDateFilterDialog || showStatusFilterDialog || showSortByFilterDialog) {
               document.addEventListener('mousedown', handleClickOutside);
          }

          // Cleanup event listener
          return () => {
               document.removeEventListener('mousedown', handleClickOutside);
          };
     }, [showDateFilterDialog, showStatusFilterDialog, showSortByFilterDialog]);

     //Handling the Date filter
     const handleShowDateFiltering = () => {
          setShowDateFilterDialog(!showDateFilterDialog);
          setShowSortByFilterDialog(false);
          setShowStatusFilterDialog(false);
     }

     // Handling the Sort By Filter
     const handleShowSortByFiltering = () => {
          setShowDateFilterDialog(false);
          setShowSortByFilterDialog(!showSortByFilterDialog);
          setShowStatusFilterDialog(false);
     }

     // Handling the Status Filter
     const handleShowStatusFilering = () => {
          setShowSortByFilterDialog(false);
          setShowDateFilterDialog(false);
          setShowStatusFilterDialog(!showStatusFilterDialog);
     }

     return (
          <>
               <div className="flex overflow-hidden h-screen relative">
                    {/* Sidebar at left side, having navigation to different routes*/}
                    <SideBar />

                    {/* Main Content with a header and with all main content about messages */}
                    <div className="flex flex-1 flex-col overflow-hidden">

                         {/* Header of the messages */}
                         <Header />

                         <main className="flex-1 p-6 bg-gray-50 overflow-y-auto ">
                              <div className="max-w-7xl mx-auto">

                                   {/* Message title with some information and a Link to "Send New Message" */}
                                   <div className="flex flex-row items-center justify-between">
                                        <div className="flex flex-col">
                                             <div>
                                                  <h2 className="font-bold text-2xl text-gray-800">All Messages</h2>
                                             </div>
                                             <div>
                                                  <span className="text-gray-500 text-[14.5px]">
                                                       View and manage all your WhatsApp messages in one place
                                                  </span>
                                             </div>
                                        </div>
                                        <div>
                                             <Link to={"/componse-new-message"} className="flex flex-row items-center justify-center bg-green-400 text-white rounded-lg font-medium text-sm px-4 py-3 hover:opacity-90 gap-2">
                                                  <RiSendPlaneLine size={20} />
                                                  <span>Send New Message</span>
                                             </Link>
                                        </div>
                                   </div>

                                   {/* Bulk Buttons to for search and filtering */}
                                   <div className="flex flex-row items-center justify-between p-4 bg-white rounded-xl mt-10 w-full shadow-sm">
                                        {/* Search box to search in message */}
                                        <div className='w-[60%] relative'>
                                             <CustomInput
                                                  placeholder={"Search in messages ...."}
                                                  value={searchMessages}
                                                  handleOnChange={handleSearchChange}
                                                  name={"searchMessages"}
                                             />
                                             {isSearching && (
                                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                       <Spinner size="small" />
                                                  </div>
                                             )}
                                        </div>
                                        <div className="flex flex-row justify-between gap-x-2 w-[38%] relative">

                                             {/* Filter messages by starting and ending date*/}
                                             <div ref={dateFilterRef}>
                                                  <FilterButton
                                                       icon={
                                                            <CiCalendar
                                                                 size={20}
                                                                 className="text-gray-600"
                                                            />
                                                       }
                                                       title={`Date Range${(dateFilter.startDate || dateFilter.endDate) ? ' ✓' : ''}`}
                                                       handleClick={handleShowDateFiltering}
                                                  />
                                                  {
                                                       showDateFilterDialog &&
                                                       <div className="absolute top-14 z-50 right-50">
                                                            <FilterCard
                                                                 filterName={"Date Range"}
                                                                 dateFilter={dateFilter}
                                                                 onApplyDateFilter={applyDateFilter}
                                                            />
                                                       </div>
                                                  }
                                             </div>

                                             {/* Filter messages by status */}
                                             <div ref={statusFilterRef}>
                                                  <FilterButton
                                                       title={`Status${!statusFilter.all ? ' ✓' : ''}`}
                                                       icon={
                                                            <RiCheckDoubleLine size={20}
                                                                 className="text-gray-600"
                                                            />
                                                       }
                                                       handleClick={handleShowStatusFilering}

                                                  />
                                                  {
                                                       showStatusFilterDialog &&
                                                       <div className="absolute top-14 z-50 right-40">
                                                            <FilterCard
                                                                 filterName={"Status"}
                                                                 statusFilter={statusFilter}
                                                                 onApplyStatusFilter={applyStatusFilter}
                                                            />
                                                       </div>
                                                  }
                                             </div>

                                             {/* Filter messages by sorting e.g(newer, older, name, status etc.) */}
                                             <div ref={sortByFilterRef}>
                                                  <FilterButton
                                                       title={`Sort by${sortBy !== 'byNewestDate' ? ' ✓' : ''}`}
                                                       icon={
                                                            <HiSortDescending
                                                                 size={20}
                                                                 className="text-gray-600"
                                                            />
                                                       }
                                                       handleClick={handleShowSortByFiltering}
                                                  />
                                                  {
                                                       showSortByFilterDialog &&
                                                       <div className="absolute top-14 z-50 right-10">
                                                            <FilterCard
                                                                 filterName={"Sort By"}
                                                                 sortBy={sortBy}
                                                                 onApplySortFilter={applySortFilter}
                                                            />
                                                       </div>
                                                  }
                                             </div>
                                        </div>
                                   </div>

                                   {/* Active filters and clear button */}
                                   {hasActiveFilters() && (
                                        <div className="flex flex-row items-center justify-between p-3 bg-blue-50 rounded-lg mt-4 border border-blue-200">
                                             <div className="flex flex-row items-center gap-2 text-sm text-blue-700">
                                                  <span className="font-medium">Active Filters:</span>
                                                  {searchMessages.trim() && (
                                                       <span className="bg-blue-100 px-2 py-1 rounded-full text-xs">
                                                            Search: "{searchMessages}"
                                                       </span>
                                                  )}
                                                  {(dateFilter.startDate || dateFilter.endDate) && (
                                                       <span className="bg-blue-100 px-2 py-1 rounded-full text-xs">
                                                            Date Range
                                                       </span>
                                                  )}
                                                  {!statusFilter.all && (
                                                       <span className="bg-blue-100 px-2 py-1 rounded-full text-xs">
                                                            Status Filter
                                                       </span>
                                                  )}
                                                  {sortBy !== 'byNewestDate' && (
                                                       <span className="bg-blue-100 px-2 py-1 rounded-full text-xs">
                                                            Custom Sort
                                                       </span>
                                                  )}
                                             </div>
                                             <button
                                                  onClick={clearAllFilters}
                                                  className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                                             >
                                                  Clear All Filters
                                             </button>
                                        </div>
                                   )}

                                   {/* All Messages with All actions, such as replying, deleting, and checking */}
                                   <div className='bg-white rounded-xl shadow-sm overflow-hidden my-10'>
                                        <div className='overflow-x-auto'>

                                             {/* Loading State */}
                                             {isLoading ? (
                                                  <div className="flex flex-col items-center justify-center py-20">
                                                       <Spinner size="large" />
                                                       <p className="text-gray-500 mt-4 text-sm">Loading messages...</p>
                                                  </div>
                                             ) : isError ? (
                                                  /* Error State */
                                                  <div className="flex flex-col items-center justify-center py-20">
                                                       <div className="text-red-400 mb-4">
                                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                            </svg>
                                                       </div>
                                                       <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load messages</h3>
                                                       <p className="text-gray-500 text-sm mb-4">
                                                            {isError || "Something went wrong while loading your messages."}
                                                       </p>
                                                       <button 
                                                            onClick={retryFetch} 
                                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                                       >
                                                            Try Again
                                                       </button>
                                                  </div>
                                             ) : (
                                                  /* Messages table component with actions */
                                                  <div className="relative">
                                                       {isFilterLoading && (
                                                            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                                                                 <div className="flex flex-col items-center">
                                                                      <Spinner size="medium" />
                                                                      <p className="text-gray-500 mt-2 text-sm">Applying filters...</p>
                                                                 </div>
                                                            </div>
                                                       )}
                                                       <AllMessagesTable 
                                                            searchQuery={searchMessages}
                                                            filteredMessages={getFilteredAndSortedMessages()}
                                                            isLoading={isLoading}
                                                       />
                                                  </div>
                                             )}

                                             {/* Pagination at last of tables - only show when not loading */}
                                             {!isLoading && !isError && (
                                                  <div className="px-6 py-4 rounded-bl-xl rounded-br-xl w-full bg-gray-50 border border-gray-200 flex items-center justify-between">
                                                       <div className="flex flex-row gap-x-3 items-center w-full">
                                                            <span className='text-gray-500 text-sm'>
                                                                 {searchMessages.trim() || !statusFilter.all || dateFilter.startDate || dateFilter.endDate ? (
                                                                      `Showing ${filteredCount} of ${totalCount} Results ${filteredCount !== totalCount ? '(filtered)' : ''}`
                                                                 ) : (
                                                                      `Showing 1 to ${Math.min(10, totalCount)} of ${totalCount} Results`
                                                                 )}
                                                            </span>
                                                            <div className="text-sm border border-gray-200 px-3 py-1 rounded-full">
                                                                 <select className="outline-none" name="messagesPerPage">
                                                                      <option value="10">10 per page</option>
                                                                      <option value="10">25 per page</option>
                                                                      <option value="10">50 per page</option>
                                                                      <option value="10">75 per page</option>
                                                                 </select>
                                                            </div>
                                                       </div>

                                                       {/* Pagination at footer with some options */}
                                                       <FooterPagination />
                                                  </div>
                                             )}
                                        </div>
                                   </div>
                              </div>
                         </main>
                    </div>
               </div>
          </>
     )
}

export default Messages
