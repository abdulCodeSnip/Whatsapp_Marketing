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


const Messages = () => {

     const [searchMessages, setSearchMessages] = useState("");
     const [showDateFilterDialog, setShowDateFilterDialog] = useState(false);
     const [showSortByFilterDialog, setShowSortByFilterDialog] = useState(false);
     const [showStatusFilterDialog, setShowStatusFilterDialog] = useState(false);

     const [deleteMessageDialog, setDeleteMessageDialog] = useState(false);
     const [selectedMessageId, setSelectedMessageId] = useState(null);
     const [selectedMessagesIDs, setSelectedMessagesIDs] = useState([]);
     const [showForwardMessageDialog, setShowForwardMessageDialog] = useState(false);
     const [showFAQs, setShowFAQs] = useState(false);
     const [showNotifications, setShowNotifications] = useState(false);
     const [changeFAQsSearchInput, setChangeFAQsSearchInput] = useState("");

     const [checkAllCheckBoxes, setCheckAllCheckBoxes] = useState(false);




     const authInformation = useSelector((state) => state?.auth?.authInformation.at(0));
     const [currenUserDetail, setCurrentUserDetail] = useState([]);
     const [recentMessages, setRecentMessages] = useState([]);


     const fetchAllMessages = async () => {
          try {
               const apiResponse = await fetch(`${authInformation?.baseURL}/messages/history/12`, {
                    method: "GET",
                    headers: {
                         "Authorization": authInformation?.token
                    }
               });

               const result = await apiResponse.json();
               if (apiResponse.ok) {
                    setRecentMessages(result);
                    console.log(result);
               } else {
                    console.log("You're missing something");
               }
          } catch (error) {
               console.log("Something is wrong !", error);
          }
     }

     const id = recentMessages?.receiver?.id || 12;
     const getUserDetail = async () => {
          try {
               const apiResponse = await fetch(`${authInformation?.baseURL}/users/${id}`, {
                    method: "GET",
                    headers: {
                         "Authorization": authInformation?.token,
                    },
               });
               const result = await apiResponse.json();
               if (apiResponse?.ok && apiResponse?.status === 200) {
                    setCurrentUserDetail(result);
                    console.log(result);
               }
          } catch (error) {
               console.log("Something is wrong with your request", error);
          }
     }

     useEffect(() => {
          fetchAllMessages();
          getUserDetail();
     }, [])

     // Function to handle FAQ button just at the right header corner of Dashboard Page
     const handleShowFAQs = () => {
          setShowFAQs(!showFAQs);
          setShowNotifications(false);
     }

     // Function to Handle Notification Button
     const handleShowNotifications = () => {
          setShowFAQs(false);
          setShowNotifications(!showNotifications);
     };

     // Custom Messages for checking, later we'll add real time data in our component

     const [userMessages, setUserMessages] = useState(
          [
               {
                    id: 1, message: "This is all about coding, where everything can be done with code, you just know how to do that",
                    contactName: "Harry Potter",
                    contactPhoneNumber: "+1 104112 45234 33",
                    messageDate: "12/04/2025",
                    messageTimeStamp: "10:56PM",
                    messageStatus: "Delivered",
               },
          ]);

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

     // A function to check if all the checkboxes are checked or not

     const selecteAllCheckBoxes = () => {
          if (selectedMessagesIDs.length === userMessages.length) {
               setSelectedMessagesIDs([]);
          } else {
               setSelectedMessagesIDs(userMessages.map((msg) => msg.id));
          }
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

               {/* Custom Notification Bar if notification icons is pressed */}
               {
                    showNotifications && (
                         <div className="fixed top-15 right-10 w-[350px] divide-y space-y-2 divide-gray-200 bg-white border border-gray-300 rounded-2xl shadow-lg z-50">
                              <div className="flex flex-row items-center justify-between p-4">
                                   <div>
                                        <h2 className="font-medium">Notifications</h2>
                                   </div>
                                   <div>
                                        <button
                                             className="text-green-500 text-xs">
                                             Mark all as read
                                        </button>
                                   </div>
                              </div>
                              <NotificationCustomCard
                                   title={"Your Appointment"}
                                   time={"2min ago"}
                                   footer={"Your Appointment has been confirmed with our HR"} />

                              <NotificationCustomCard
                                   title={"Your Appointment"}
                                   time={"2min ago"}
                                   footer={"Your Appointment has been confirmed with our HR"} />

                              <NotificationCustomCard
                                   title={"Your Appointment"}
                                   time={"2min ago"}
                                   footer={"Your Appointment has been confirmed with our HR"} />

                              {/* Link to show All notifications */}
                              <Link to={"#"}
                                   className="flex flex-row gap-x-2 p-3 text-green-500 items-center justify-center">
                                   <div>
                                        <h2 className="text-sm font-medium">View all notifications</h2>
                                   </div>
                                   <div>
                                        <FaArrowRight size={13} />
                                   </div>
                              </Link>
                         </div>
                    )}

               {/* Custom FAQs bar if the FAQs Icons is pressed */}

               {
                    showFAQs && (
                         <FAQsCard
                              setChangeFAQsSearchInput={setChangeFAQsSearchInput}
                              closeFAQs={() => setShowFAQs(false)}
                              changeFAQsSearchInput={changeFAQsSearchInput}
                         />
                    )
               }

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
                                             <table className='min-w-full divide-y divide-gray-200'>
                                                  <thead className='bg-gray-50'>
                                                       <tr>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-10">
                                                                 <input type="checkbox" className="accent-green-600 w-[18px] h-[18px] rounded-xl outline-none border-green-400 cursor-pointer" checked={selectedMessagesIDs.length === userMessages.length} value={checkAllCheckBoxes} onChange={selecteAllCheckBoxes} />
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                                                                 Contact
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                 Message
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                                                                 Status
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                 Date
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs min-w-[120px] font-medium text-gray-500 uppercase tracking-wider w-10">
                                                                 Actions
                                                            </th>
                                                       </tr>
                                                  </thead>

                                                  <tbody className="bg-white divide-y divide-gray-200 relative">


                                                       {
                                                            userMessages.map(userMsg => (
                                                                 <>
                                                                      <FullMessageOverview
                                                                           contactName={currenUserDetail?.user?.first_name + " " + currenUserDetail?.user?.last_name}
                                                                           contactPhoneNumber={currenUserDetail?.user?.phone}
                                                                           messageDate={(recentMessages?.chat?.at(recentMessages?.chat?.length - 1)?.updated_at)?.split("T")?.at(0)}
                                                                           messageTimeStamp={(recentMessages?.chat?.at(recentMessages?.chat?.length - 1)?.updated_at)?.split("T")?.at(1)?.split(".").at(0)?.slice(0, 5)}
                                                                           messageStatus={recentMessages?.chat?.at(recentMessages?.chat?.length - 1)?.status}
                                                                           messageText={recentMessages?.chat?.at(recentMessages?.chat?.length - 10)?.content}
                                                                           deleteMessage={() => {
                                                                                setSelectedMessageId(userMsg.id);
                                                                                setDeleteMessageDialog(true);
                                                                           }}
                                                                           forwardMessage={() => handleMessageForwardDialog()}
                                                                           isAllChecked={selectedMessagesIDs.includes(userMsg.id)}
                                                                           handleCheckBox={() => handleCheckBoxIndividually(userMsg.id)}
                                                                      />

                                                                      {/* if Delete Icon is pressed, then this would be on top of everything */}


                                                                      {deleteMessageDialog && (
                                                                           <div className="fixed inset-0 bg-black/10 bg-opacity-20 z-40">
                                                                                {/* This div is just for dimming the background if delete messages dialog is opened, otherwise the background would be smooth */}
                                                                           </div>
                                                                      )}
                                                                      {
                                                                           deleteMessageDialog && selectedMessageId === userMsg.id &&
                                                                           <div className='fixed top-32 z-50 h-auto right-88 bg-white rounded-2xl border-gray-200 border-1 p-5 w-[550px] shadow-gray-200'>
                                                                                <DeleteMessageDialog
                                                                                     title={"Delete Message"}
                                                                                     contactName={userMsg?.contactName}
                                                                                     contactPhone={userMsg?.contactPhoneNumber}
                                                                                     message={userMsg.message}
                                                                                     footer={"Are you sure you want to delete this message? This action cannot be undone"}
                                                                                     closeDeleteDialog={() => setDeleteMessageDialog(false)}
                                                                                     deleteMessageCompletely={() => handleDeleteMessage(selectedMessageId)}
                                                                                />
                                                                           </div>
                                                                      }

                                                                      {/* if Forward Icons is pressed, then this would be on top of everything */}

                                                                      {showForwardMessageDialog && (
                                                                           <div className="fixed inset-0 bg-black/5 bg-opacity-20 z-40">
                                                                                {/* This div is just for dimming the background if forward messages dialog is opened, otherwise the background would be smooth */}
                                                                           </div>
                                                                      )}

                                                                      {
                                                                           showForwardMessageDialog &&
                                                                           <div className='fixed top-4 z-50 h-auto right-88 bg-white rounded-2xl border-gray-200 border-1 p-5 w-[550px] shadow-gray-200'>
                                                                                <ForwardMessageDialog
                                                                                     title={"Forward"}
                                                                                     closeForwardDialog={() => setShowForwardMessageDialog(false)}
                                                                                />
                                                                           </div>
                                                                      }
                                                                 </>
                                                            ))
                                                       }

                                                  </tbody>
                                             </table>

                                             {/* Pagination at last of tables */}
                                             <div className="px-6 py-4 rounded-bl-xl rounded-br-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                                                  <div className="flex flex-row gap-x-3 items-center">
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
