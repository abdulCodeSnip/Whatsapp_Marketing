import React, { useEffect, useState } from 'react'
import { MdOutlineDashboard, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { RiMessage2Line, RiContactsBookLine, RiCheckDoubleLine, RiSendPlaneLine } from "react-icons/ri";
import { IoNewspaperOutline, IoSettingsOutline, IoClose } from "react-icons/io5";
import { FaArrowLeft, FaBell, FaHistory, FaSearch } from "react-icons/fa";
import { TbLayoutDashboard } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";
import { BsQuestionCircle, BsFileEarmarkPlus } from "react-icons/bs";
import { LuBellRing } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { TbUserPlus } from "react-icons/tb";
import { FaArrowRight, FaRotate } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CustomInput from '../Components/customInput';
import DashboardCard from '../Components/dashboardCard';
import CustomLinkButton from '../Components/customLinkButton';
import MessageCard from '../Components/messageCard';
import CampaignCard from '../Components/campaignCard';
import CustomButton from '../Components/customButton';
import NotificationCustomCard from '../Components/notificationCustomCard';
import { AiOutlinePlaySquare } from "react-icons/ai";
import { BiPlus, BiRightArrow, BiVideo } from 'react-icons/bi';
import ClickableCustomButton from '../Components/clickableCustomButton';
import { TfiHeadphone } from 'react-icons/tfi';
import TemplateListingCard from '../Components/templateListingCard';
import DeleteMessageDialog from '../Components/deleteMessageDialog';
import DeleteTemplateCard from '../Components/deleteTemplateCard';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import FAQsCard from '../Components/FAQsCard';
import SideBar from '../Components/SideBar';
import Hamburger from '../Components/CreateNewTemplatePage/Hamburger';
import Header from '../Components/ContactsManagementPage/Header';
import { useSelector } from 'react-redux';

const Templates = () => {

     const [searchTemplates, setSearchTemplates] = useState("");
     const [searchTemplatesByName, setSearchTemplatesByName] = useState("");
     const [sortByCategory, setSortByCategory] = useState("");
     const [sortByStatus, setSortByStatus] = useState("");
     const [showDeleteTemplateDialog, setShowDeleteTemplateDialog] = useState(false);
     const [selectedTemplateId, setSelectedTemplateId] = useState("");
     const [selectedPage, setSelectedPage] = useState("1");

     const [showFAQs, setShowFAQs] = useState(false);
     const [showNotifications, setShowNotifications] = useState(false);
     const [changeFAQsSearchInput, setChangeFAQsSearchInput] = useState("");
     const [templates, setTemplates] = useState([]);
     const navigate = useNavigate();
     const location = useLocation();


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

     // the function "HandleSearchTemplates, works for sorting the templates based on "search value", "changing of options in Category", "changing of options in Status", and even, it can handle the "Reset Button to reset all filters, and return the total value, removing all the filters" "
     const handleSearchTemplates = (type, value) => {
          if (type === "searchByName") {
               setSearchTemplatesByName(value);
          } else if (type === "sortByCategory") {
               setSortByCategory(value);
          } else if (type === "sortByStatus") {
               setSortByStatus(value);
          } else if (type === "resetAllFilters") {
               setSortByCategory("");
               setSortByStatus("");
               setSearchTemplatesByName("");
          }
     }

     // Function to handle Pagination Buttons
     const handlePaginationButtons = (value) => {
          setSelectedPage(value);
     }

     useEffect(() => {
          handlePaginationButtons(selectedPage);
     }, [selectedPage])


     const authInformation = useSelector((state) => state?.auth?.authInformation.at(0));

     // Returning Templates from Database
     const getAllTemplates = async () => {
          try {
               const apiResponse = await fetch(`${authInformation.baseURL}/templates`, {
                    method: "GET",
                    headers: {
                         "Authorization": authInformation.token
                    },
               });
               const result = await apiResponse.json();
               setTemplates(result);
          } catch (error) {
               console.log(error);
          }
     }

     useEffect(() => {
          getAllTemplates();
     }, [templates]);

     // Delete templates when clicked on "Detele Template inside the Dialog Box "
     const deleteTemplate = async (deletedTemplateId) => {
          try {
               const apiResponse = await fetch(`${authInformation.baseURL}/templates/${deletedTemplateId}`, {
                    method: "DELETE",
                    headers: {
                         "Authorization": authInformation.token
                    },
               });
               const result = await apiResponse.json();
               console.log(result);
          } catch (error) {
               console.log("Something went wrong at the Backend! " + error.message);
          } finally {
               setShowDeleteTemplateDialog(false);
          }
     }

     return (

          <>
               {/* Custom Notification Bar if notification icons is pressed */}
               {
                    showNotifications &&
                    <div onClick={() => setShowNotifications(false)} className="fixed inset-0 bg-black/10 h-[120vh] w-[120vw] bg-opacity-20 z-40">
                         {/* This div is just for dimming the background if delete messages dialog is opened, otherwise the background would be smooth */}
                    </div>
               }
               {
                    showNotifications && (
                         <div onFocus={() => setShowNotifications(true)} onBlur={() => setShowNotifications(false)} className="fixed top-15 right-10 w-[350px] divide-y space-y-2 divide-gray-200 bg-white border border-gray-300 rounded-2xl shadow-lg z-50">
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
                    showFAQs &&
                    <div onClick={() => setShowFAQs(false)} className="fixed inset-0 bg-black/10 h-[120vh] w-[120vw] bg-opacity-20 z-40">
                         {/* This div is just for dimming the background if delete messages dialog is opened, otherwise the background would be smooth */}
                    </div>
               }
               {
                    showFAQs && (
                         <FAQsCard
                              closeFAQs={() => setShowFAQs(false)}
                              changeFAQsSearchInput={changeFAQsSearchInput}
                              setChangeFAQsSearchInput={() => setChangeFAQsSearchInput()}
                         />
                    )
               }
               <div className="flex overflow-hidden h-screen">
                    {/* Sidebar at left side */}
                    <SideBar />

                    {/* Main Content with a header and with all main content about messages */}
                    <div className="flex-1 flex flex-col h-screen overflow-hidden">

                         {/* Header of the "Templates for user convinience" */}
                         <Header />

                         {/* Main content that would be shown on the screen */}
                         <main className='flex-1 p-6 bg-gray-50 overflow-y-auto'>

                              {/* Main content */}
                              <div className='max-w-7xl mx-auto'>

                                   <div className='flex flex-row gap-x-3'>
                                        <Hamburger firstLink={"Dashboard"} secondLink={"Templates"} />
                                   </div>

                                   {/* A useful message for Admin */}
                                   <div className='my-5 flex flex-row space-y-2 justify-between items-center'>
                                        <div>
                                             <div>
                                                  <h2 className='font-semibold text-2xl'>
                                                       Templates
                                                  </h2>
                                             </div>
                                             <div className='text-gray-600 text-sm'>
                                                  <span>Manage your Whatsapp message templates for campaigns and automations</span>
                                             </div>
                                        </div>

                                        <div>
                                             <Link to={"/templates/create-new-template"} className='flex flex-row items-center justify-center gap-x-2 p-2 bg-[#25D366] text-white font-medium text-sm shadow-sm rounded-lg px-4 py-2'>
                                                  <BiPlus size={20} />
                                                  <span>Create New Template</span>
                                             </Link>
                                        </div>
                                   </div>

                                   <div className='bg-white flex flex-row items-center justify-between p-[14px] shadow-xs rounded-xl'>
                                        {/* Search in Templates, also with "Category Sorting", "Status Sorting" */}
                                        <div className='flex flex-row items-center justify-between gap-x-5'>
                                             <div className='flex flex-col items-start justify-center gap-1'>
                                                  <p className='text-gray-700 font-medium text-sm mx-2'>Search Template</p>
                                                  <input
                                                       value={searchTemplatesByName}
                                                       onChange={(e) => {
                                                            handleSearchTemplates("searchByName", e.target.value);
                                                            setSearchTemplatesByName(e.target.value);
                                                       }}
                                                       placeholder="Search by name..."
                                                       className='px-3 py-2 outline-none flex w-[340px] focus:border-black border-gray-200 border-1 rounded-lg' />
                                             </div>

                                             {/* Category Sorting Button with Multiple Options */}
                                             <div className='flex flex-col items-start justify-center gap-1'>
                                                  <p className='text-gray-700 font-medium text-sm'>Category</p>
                                                  <select onChange={(e) => handleSearchTemplates("sortByCategory", e.target.value)} className='px-4 py-2 rounded-lg border-1 text-gray-700 cursor-pointer border-gray-300 focus:border-black'>
                                                       <option value={""}>All Category</option>
                                                       <option value={"Marketing"}>Marketing</option>
                                                       <option value={"Transactional"}>Transactional</option>
                                                       <option value={"Authentication"}>Authentication</option>
                                                       <option value={"Utility"}>Utility</option>
                                                       <option value={"Customer Support"}>Customer Support</option>
                                                  </select>
                                             </div>

                                             {/* Template status Sorting */}
                                             <div className='flex flex-col items-start justify-center gap-1'>
                                                  <p className='text-gray-700 font-medium text-sm'>Status</p>
                                                  <select
                                                       onChange={(e) => handleSearchTemplates("sortByStatus", e.target.value)}
                                                       className='pl-3 pr-12 shadow-sm appearance-auto py-2 rounded-lg cursor-pointer border-1 text-gray-700 border-gray-300 focus:border-black'>
                                                       <option value={""}>All Statuses</option>
                                                       <option value={"Approved"}>Approved</option>
                                                       <option value={"Pending"}>Pending</option>
                                                       <option value={"Rejected"}>Rejected</option>
                                                  </select>
                                             </div>
                                        </div>

                                        {/* Reset Filters Button */}
                                        <div onClick={(e) => handleSearchTemplates("resetAllFilters", e.target.value)} className='border-gray-300 border-1 px-4 py-2 rounded-lg hover:bg-gray-50 bg-white cursor-pointer'>
                                             <div className='flex flex-row items-center gap-x-2 justify-center text-gray-700 cursor-pointer'>
                                                  <FaRotate />
                                                  <button className='cursor-pointer'>Reset Filters</button>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Table for all templates, to manage, such as edit templates, delete, or duplicate any template */}
                                   <div className='bg-white rounded-xl overflow-hidden border border-gray-200 my-5'>
                                        <div className='overflow-auto divide-y divide-gray-200'>
                                             <table className="min-w-full divide-y divide-gray-200">
                                                  <thead className='bg-gray-50'>
                                                       <tr>
                                                            <th scope="col" className='text-gray-500 font-medium px-6 tracking-wider uppercase text-xs text-left py-5'>Template Name</th>
                                                            <th scope="col" className='text-gray-500 font-medium px-6 tracking-wider uppercase text-xs text-left py-3'>Category</th>
                                                            <th scope="col" className='text-gray-500 font-medium px-6 tracking-wider uppercase text-xs text-left py-3'>Status</th>
                                                            <th scope="col" className='text-gray-500 font-medium px-6 tracking-wider uppercase text-xs text-left py-3'>Date Created</th>
                                                            <th scope="col" className='text-gray-500 font-medium px-6 tracking-wider uppercase text-xs text-left py-3'>Actions</th>
                                                       </tr>
                                                  </thead>
                                                  <tbody className='bg-white divide-y divide-gray-200 space-y-2'>
                                                       {
                                                            // Default templates, we'll add real time templates later
                                                            templates?.templates?.filter((mytemp) => mytemp?.name?.toLowerCase()?.includes
                                                                 (searchTemplatesByName.toLowerCase()) &&
                                                                 (sortByCategory === "" || mytemp?.category?.name === sortByCategory) &&
                                                                 (sortByStatus === "" || mytemp?.status === sortByStatus)
                                                            )
                                                                 .map((template) =>
                                                                      <>
                                                                           <TemplateListingCard
                                                                                templateName={
                                                                                     template?.name?.split(" ")?.map(tname => tname.charAt(0).toUpperCase() + tname.slice(1) + " ")}
                                                                                templateCategory={template?.category?.name}
                                                                                templateStatus={template?.status}
                                                                                templateCreateDate={template?.created_at?.split("T")?.at(0)}
                                                                                templateLanguage={template?.language}
                                                                                editTemplate={() => navigate(`/templates/${template?.id}`)}
                                                                                deleteTemplateAction={() => {
                                                                                     setShowDeleteTemplateDialog(true);
                                                                                     setSelectedTemplateId(template?.id);
                                                                                }}
                                                                           />


                                                                           {
                                                                                showDeleteTemplateDialog && selectedTemplateId === template?.id &&
                                                                                <div className='fixed top-52 z-50 right-[400px] bg-white rounded-2xl border-gray-200 border-1 p-5 w-md h-auto shadow-gray-200'>
                                                                                     <DeleteTemplateCard
                                                                                          title={"Delete Template"}
                                                                                          deleteTemplateCompletely={
                                                                                               () => deleteTemplate(template?.id)}
                                                                                          closeDialog={() => setShowDeleteTemplateDialog(false)}
                                                                                     />
                                                                                </div>
                                                                           }
                                                                      </>
                                                                 )
                                                       }

                                                  </tbody>
                                             </table>

                                             <div className='flex flex-row items-center justify-between bg-gray-100'>
                                                  <div>
                                                       <h2 className='text-gray-600 text-md px-5 py-2'>
                                                            Showing 1 to 6 of 12 results
                                                       </h2>
                                                  </div>

                                                  <div className='flex flex-row divide-x-1 text-gray-500 divide-gray-200 rounded-2xl border-gray-200 border-1 m-3'>
                                                       <button onClick={() => handlePaginationButtons(0)} className='w-[40px] h-[40px] rounded-l-2xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer'>
                                                            <IoIosArrowBack size={15} />
                                                       </button>
                                                       <button onClick={(e) => handlePaginationButtons(e.target.textContent)} className={`w-[40px] h-[40px] flex items-center justify-center ${selectedPage == 1 ? "bg-green-500 text-white hover:bg-green-400" : "bg-gray-50 text-gray-500"} hover:bg-gray-100 cursor-pointer`}>
                                                            1
                                                       </button>
                                                       <button onClick={(e) => handlePaginationButtons(e.target.textContent)} className={`w-[40px] h-[40px] flex items-center justify-center ${selectedPage == 2 ? "bg-green-500 text-white hover:bg-green-400" : "bg-gray-50 text-gray-500"} hover:bg-gray-100 cursor-pointer`}>
                                                            2
                                                       </button>
                                                       <button onClick={() => handlePaginationButtons(0)} className='w-[40px] h-[40px] rounded-r-2xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer'>
                                                            <IoIosArrowForward size={20} />
                                                       </button>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* if Delete Template icon is pressed, then we'll show the dialog box for confirmation to delete that template */}
                                        {showDeleteTemplateDialog && (
                                             <div className="fixed inset-0 bg-black/10 bg-opacity-20 h-[120vh] w-[120vw] z-40">
                                                  {/* This div is just for dimming the background if delete messages dialog is opened, otherwise the background would be smooth */}
                                             </div>
                                        )}
                                   </div>
                              </div>
                         </main>
                    </div>
               </div>
          </>

     )
}

export default Templates
