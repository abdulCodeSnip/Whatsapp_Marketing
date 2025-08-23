import React, { useEffect, useState } from 'react'
import { MdOutlineDashboard, MdArticle, MdMessage } from "react-icons/md";
import { RiMessage2Line, RiContactsBookLine, RiCheckDoubleLine, RiSendPlaneLine } from "react-icons/ri";
import { IoNewspaperOutline, IoSettingsOutline, IoClose } from "react-icons/io5";
import { FaArrowLeft, FaHistory, FaSearch } from "react-icons/fa";
import { CiSearch, CiCalendar } from "react-icons/ci";
import { BsQuestionCircle, BsFileEarmarkPlus } from "react-icons/bs";
import { LuBellRing } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { TbUserPlus } from "react-icons/tb";
import { FaArrowLeftLong, FaArrowRight } from "react-icons/fa6";
import { Link, useLocation } from 'react-router-dom';
import CustomInput from '../Components/customInput';
import NotificationCustomCard from '../Components/notificationCustomCard';
import { AiOutlinePlaySquare } from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";


import { BiCalendar, BiCalendarAlt, BiVideo } from 'react-icons/bi';
import ClickableCustomButton from '../Components/clickableCustomButton';
import { TfiHeadphone } from 'react-icons/tfi';
import { CgCalendar } from 'react-icons/cg';
import FilterButton from '../Components/filterButton';
import FullMessageOverview from '../Components/fullMessageOverview';
import FilterCard from '../Components/filterCard';
import DeleteMessageDialog from '../Components/deleteMessageDialog';
import ForwardMessageDialog from '../Components/forwardMessageDialog';
import { HiSortDescending } from 'react-icons/hi';
import SideBar from '../Components/SideBar';
import FAQsCard from '../Components/FAQsCard';
import Header from '../Components/ContactsManagementPage/Header';
import FooterPagination from '../Components/footerPagination';
import { useSelector } from 'react-redux';
import AllMessagesTable from '../Components/Messages/AllMessagesTable';
import useFetchMessages from '../hooks/useFetchMessages';
import { current } from '@reduxjs/toolkit';


const Messages = () => {

     const [searchMessages, setSearchMessages] = useState("");
     const [showDateFilterDialog, setShowDateFilterDialog] = useState(false);
     const [showSortByFilterDialog, setShowSortByFilterDialog] = useState(false);
     const [showStatusFilterDialog, setShowStatusFilterDialog] = useState(false);

     const [deleteMessageDialog, setDeleteMessageDialog] = useState(false);
     const [selectedMessageId, setSelectedMessageId] = useState(null);
     const [selectedMessagesIDs, setSelectedMessagesIDs] = useState([]);
     const [showForwardMessageDialog, setShowForwardMessageDialog] = useState(false);

     const { isLoading, isError, messages, currentUser } = useFetchMessages(20);

     const [userMessages, setUserMessages] = useState([]);

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

     // Show a dialog or custom bar to the user for selecting "cancel" or "delete", after that process this method
     // Delete a message by its id, and get others after deleting that specific message
     const handleDeleteMessage = (id) => {

          // Delete a message only by clicking a particular contact
          setUserMessages(prev => prev.filter(msg => msg.id !== id));
          setDeleteMessageDialog(false);

     }

     // Handle Message Forwarding Dialog 
     const handleMessageForwardDialog = () => {
          setShowForwardMessageDialog(true);
     }

     // Handling each checkbox individually
     const handleCheckBoxIndividually = (id) => {
          setSelectedMessagesIDs((previous) => {
               if (previous.includes(id)) {
                    // UnCheck, it will return all other elements which was unchecked
                    return previous.filter((msgId) => msgId !== id);
               } else {
                    // Checked
                    return [...previous, id];
               }
          });
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
                                             <div>
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
                                             </div>

                                             {
                                                  showDateFilterDialog &&
                                                  <div className="absolute top-14 z-50 right-50">
                                                       <FilterCard
                                                            filterName={"Date Range"}
                                                       />
                                                  </div>
                                             }

                                             {/* Filter messages by status */}
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

                                             {/* Filter messages by sorting e.g(newer, older, name, status etc.) */}
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

                                   {/* All Messages with All actions, such as replying, deleting, and checking */}
                                   <div className='bg-white rounded-xl shadow-sm overflow-hidden my-10'>
                                        <div className='overflow-x-auto'>

                                             {/* Messages table component with actions */}
                                             <AllMessagesTable />

                                             {/* Pagination at last of tables */}
                                             <div className="px-6 py-4 rounded-bl-xl rounded-br-xl w-full bg-gray-50 border border-gray-200 flex items-center justify-between">
                                                  <div className="flex flex-row gap-x-3 items-center w-full">
                                                       <span className='text-gray-500 text-sm'>
                                                            Showing 1 to 10 of 88 Results
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
