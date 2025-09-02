import React, { useEffect, useState, useRef } from 'react'
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


const Messages = () => {

     const [searchMessages, setSearchMessages] = useState("");
     const [showDateFilterDialog, setShowDateFilterDialog] = useState(false);
     const [showSortByFilterDialog, setShowSortByFilterDialog] = useState(false);
     const [showStatusFilterDialog, setShowStatusFilterDialog] = useState(false);

     // Refs for dropdown containers
     const dateFilterRef = useRef(null);
     const statusFilterRef = useRef(null);
     const sortByFilterRef = useRef(null);

     // Get messages for search count
     const { messages, currentUser } = useFetchMessages(20);

     // Calculate filtered messages count for display
     const getFilteredCount = () => {
          if (!searchMessages.trim()) {
               return messages?.length || 0;
          }

          const query = searchMessages.toLowerCase().trim();
          
          return (messages || []).filter(userMsg => {
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
          }).length;
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
                                        <div className='w-[60%]'>
                                             <CustomInput
                                                  placeholder={"Search in messages ...."}
                                                  value={searchMessages}
                                                  handleOnChange={(e) => setSearchMessages(e.target.value)}
                                                  name={"searchMessages"}
                                             />
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
                                                       title={"Date Range"}
                                                       handleClick={handleShowDateFiltering}
                                                  />
                                                  {
                                                       showDateFilterDialog &&
                                                       <div className="absolute top-14 z-50 right-50">
                                                            <FilterCard
                                                                 filterName={"Date Range"}
                                                            />
                                                       </div>
                                                  }
                                             </div>

                                             {/* Filter messages by status */}
                                             <div ref={statusFilterRef}>
                                                  <FilterButton
                                                       title={"Status"}
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
                                                            />
                                                       </div>
                                                  }
                                             </div>

                                             {/* Filter messages by sorting e.g(newer, older, name, status etc.) */}
                                             <div ref={sortByFilterRef}>
                                                  <FilterButton
                                                       title={"Sort by"}
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
                                                            />
                                                       </div>
                                                  }
                                             </div>
                                        </div>
                                   </div>

                                   {/* All Messages with All actions, such as replying, deleting, and checking */}
                                   <div className='bg-white rounded-xl shadow-sm overflow-hidden my-10'>
                                        <div className='overflow-x-auto'>

                                             {/* Messages table component with actions */}
                                             <AllMessagesTable searchQuery={searchMessages} />

                                             {/* Pagination at last of tables */}
                                             <div className="px-6 py-4 rounded-bl-xl rounded-br-xl w-full bg-gray-50 border border-gray-200 flex items-center justify-between">
                                                  <div className="flex flex-row gap-x-3 items-center w-full">
                                                       <span className='text-gray-500 text-sm'>
                                                            {searchMessages.trim() ? (
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
