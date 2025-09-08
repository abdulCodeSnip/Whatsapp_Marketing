import React, { useEffect, useState } from 'react'
import { RiMessage2Line, RiCheckDoubleLine, RiSendPlaneLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { BsFileEarmarkPlus } from "react-icons/bs";
import { LuNewspaper } from "react-icons/lu";
import { TbUserPlus } from "react-icons/tb";
import { FaArrowRight } from "react-icons/fa6";
import { Link, useLocation, } from 'react-router-dom';
import CustomInput from '../Components/customInput';
import DashboardCard from '../Components/dashboardCard';
import CustomLinkButton from '../Components/customLinkButton';
import CampaignCard from '../Components/campaignCard';
import CustomButton from '../Components/customButton';
import NotificationCustomCard from '../Components/notificationCustomCard';
import { AiOutlinePlaySquare } from "react-icons/ai";
import { TfiHeadphone } from 'react-icons/tfi';
import Header from '../Components/ContactsManagementPage/Header';
import SideBar from '../Components/SideBar';
import { useDispatch, useSelector } from 'react-redux';
import { addTemplates } from '../redux/templatePage/allTemplates';
import RecentMessages from '../Components/Dashboard/RecentMessages';
import { allContacts } from '../redux/contactsPage/contactsFromAPI';
import Spinner from '../Components/Spinner';
import { authUtils, authenticatedFetch } from '../utils/auth';

const Dashboard = () => {
     const [showFAQs, setShowFAQs] = useState(false);
     const [showNotifications, setShowNotifications] = useState(false);
     const [changeFAQsSearchInput, setChangeFAQsSearchInput] = useState("");
     const [user, setUser] = useState(null);
     const [isLoading, setIsLoading] = useState(true);
     const [isDataLoading, setIsDataLoading] = useState(true);
     const [error, setError] = useState(null);

     const loggedInUser = useSelector((state) => state?.loginUser?.userLogin);

     const dispatch = useDispatch();

     // all data from apis
     const [completeData, setCompleteData] = useState([
          {
               apiRoute: "/contacts",
               apiData: [],
               isLoading: true,
               error: null
          },
          {
               apiRoute: "/templates",
               apiData: [],
               isLoading: true,
               error: null
          }
     ]);

     const navigate = useNavigate();

     // Safely get data count with fallbacks
     const getDataCount = (data, routeName) => {
          try {
               if (!data || !data.apiData) return 0;
               
               const internalArray = Object.values(data.apiData)?.[0];
               if (Array.isArray(internalArray)) {
                    return internalArray.length;
               }
               
               // Fallback for different data structures
               if (routeName === "contacts" && data.apiData.users) {
                    return Array.isArray(data.apiData.users) ? data.apiData.users.length : 0;
               }
               if (routeName === "templates" && data.apiData.templates) {
                    return Array.isArray(data.apiData.templates) ? data.apiData.templates.length : 0;
               }
               
               return 0;
          } catch (error) {
               console.error(`Error getting count for ${routeName}:`, error);
               return 0;
          }
     };

     // Safely format route name
     const formatRouteName = (apiRoute) => {
          try {
               const routeName = apiRoute?.split("/").filter(Boolean)[0];
               return routeName ? routeName.charAt(0).toUpperCase() + routeName.slice(1) : "Unknown";
          } catch (error) {
               return "Unknown";
          }
     };

     // Fetch data from APIs
     const fetchAllData = async () => {
          try {
               setIsDataLoading(true);
               setError(null);

               if (!authUtils.isAuthenticated()) {
                    throw new Error('No authentication token found');
               }

               const updatedData = await Promise.all(
                    completeData.map(async (item) => {
                         try {
                              const response = await authenticatedFetch(
                                   `${import.meta.env.VITE_API_URL}${item.apiRoute}`, 
                                   {
                                        method: "GET"
                                   },
                                   navigate,
                                   dispatch
                              );

                              if (!response.ok) {
                                   throw new Error(`Failed to fetch ${item.apiRoute}: ${response.status}`);
                              }

                              const result = await response.json();

                              return {
                                   ...item,
                                   apiData: result || {},
                                   isLoading: false,
                                   error: null
                              };
                         } catch (error) {
                              console.error(`Error fetching ${item.apiRoute}:`, error);
                              return {
                                   ...item,
                                   apiData: {},
                                   isLoading: false,
                                   error: error.message
                              };
                         }
                    })
               );

               setCompleteData(updatedData);

               // Dispatch to Redux store with safe data extraction
               const templatesData = updatedData.find(item => item.apiRoute === "/templates")?.apiData?.templates;
               const contactsData = updatedData.find(item => item.apiRoute === "/contacts")?.apiData?.users;

               if (Array.isArray(templatesData)) {
                    dispatch(addTemplates(templatesData));
               }

               if (Array.isArray(contactsData)) {
                    dispatch(allContacts(contactsData));
               }

          } catch (error) {
               console.error("Error fetching data:", error);
               setError(error.message);
          } finally {
               setIsDataLoading(false);
          }
     };

     // Fetch user data such as username, email and password
     const userData = async () => {
          try {
               setIsLoading(true);
               const credentials = authUtils.getUserCredentials();

               if (!credentials.token || !credentials.email || !credentials.password) {
                    throw new Error('Missing authentication credentials');
               }

               const apiResponse = await authenticatedFetch(
                    `${import.meta.env.VITE_API_URL}/auth/login`,
                    {
                         method: "POST",
                         body: JSON.stringify({ 
                              email: credentials.email, 
                              password: credentials.password 
                         })
                    },
                    navigate,
                    dispatch
               );

               if (!apiResponse.ok) {
                    throw new Error(`Failed to fetch user data: ${apiResponse.status}`);
               }

               const result = await apiResponse.json();
               setUser(result || {});

          } catch (error) {
               console.error("Error fetching user data:", error);
               setError(error.message);
               setUser({}); // Set empty object to prevent undefined access
          } finally {
               setIsLoading(false);
          }
     };

     const { pathname } = useLocation();

     // Fetch data on component mount
     useEffect(() => {
          const initializeData = async () => {
               await Promise.all([
                    fetchAllData(),
                    userData()
               ]);
          };

          initializeData();
     }, []); // Remove pathname dependency to prevent unnecessary refetches

     // Show loading state
     if (isLoading || isDataLoading) {
          return (
               <div className="flex overflow-hidden h-screen">
                    <SideBar />
                    <div className='flex-1 flex flex-col overflow-hidden'>
                         <Header />
                         <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
                              <div className="max-w-7xl mx-auto">
                                   <div className="flex items-center justify-center h-64">
                                        <div className="flex flex-col items-center gap-4">
                                             <Spinner size="large" />
                                             <div className="text-center">
                                                  <h3 className="text-lg font-medium text-gray-900">Loading Dashboard</h3>
                                                  <p className="text-gray-500">Please wait while we fetch your data...</p>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </main>
                    </div>
               </div>
          );
     }

     // Show error state
     if (error) {
          return (
               <div className="flex overflow-hidden h-screen">
                    <SideBar />
                    <div className='flex-1 flex flex-col overflow-hidden'>
                         <Header />
                         <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
                              <div className="max-w-7xl mx-auto">
                                   <div className="flex items-center justify-center h-64">
                                        <div className="text-center">
                                             <div className="text-red-500 mb-4">
                                                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                  </svg>
                                             </div>
                                             <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load dashboard</h3>
                                             <p className="text-gray-500 mb-4">{error}</p>
                                             <button
                                                  onClick={() => window.location.reload()}
                                                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                             >
                                                  Try Again
                                             </button>
                                        </div>
                                   </div>
                              </div>
                         </main>
                    </div>
               </div>
          );
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
                         <div className="fixed top-[14%] right-[21%] w-[650px] space-y-2  bg-white border border-gray-300 rounded-2xl shadow-lg z-50">
                              <div className="flex flex-row items-center justify-between p-5">
                                   <div>
                                        <h2 className="text-lg font-semibold">
                                             Help Center
                                        </h2>
                                   </div>
                                   <div className="text-gray-600 hover:bg-gray-200 p-2 rounded-xl cursor-pointer" onClick={() => setShowFAQs(false)}>
                                        <IoClose size={20} />
                                   </div>
                              </div>
                              <hr className="text-gray-200" />
                              <div className="p-4">
                                   <CustomInput
                                        placeholder={"Search Knowledge base...."}
                                        value={changeFAQsSearchInput}
                                        handleOnChange={(e) => setChangeFAQsSearchInput(e.target.value)}
                                        name={"faqSearchInput"} />
                              </div>

                              {/* Common FAQs and Some video tutorial Options for Admin convinience */}
                              <div className="flex flex-row justify-between p-5 items-start gap-x-5">
                                   <div className="flex flex-col gap-4 justify-center">
                                        <h2 className="text-gray-800 font-semibold text-lg">
                                             Common FAQs
                                        </h2>
                                        <div className="bg-gray-100 p-3 rounded-xl text-sm cursor-pointer">
                                             <h2 className="text-gray-700 font-medium">
                                                  How do I create new Campaign ?
                                             </h2>
                                        </div>
                                        <div className="bg-gray-100 p-3 rounded-xl text-sm cursor-pointer">
                                             <h2 className="text-gray-700 font-medium">
                                                  How to import contacts ?
                                             </h2>
                                        </div><div className="bg-gray-100 p-3 rounded-xl text-sm cursor-pointer">
                                             <h2 className="text-gray-700 font-medium">
                                                  Messages Template Guide
                                             </h2>
                                        </div>
                                   </div>

                                   <div className="flex flex-col gap-4 items-start justify-center">
                                        <h2 className="text-gray-800 font-semibold text-lg">Video Tutorials</h2>

                                        <div className="bg-gray-100 p-3 rounded-xl text-sm cursor-pointer flex flex-row gap-2 items-center w-full">
                                             <div className="bg-green-100 p-2 rounded-lg">
                                                  <AiOutlinePlaySquare size={17} color="green" />
                                             </div>
                                             <h2 className="text-gray-800 font-medium">
                                                  Getting Started Guide
                                                  <p className="text-xs text-gray-500 font-medium mb-2">5 min</p>
                                             </h2>
                                        </div>
                                        <div className="bg-gray-100 p-3 rounded-xl text-sm cursor-pointer flex flex-row gap-2 items-center">
                                             <div className="bg-green-100 p-2 rounded-lg">
                                                  <AiOutlinePlaySquare size={17} color="green" />
                                             </div>
                                             <h2 className="text-gray-800 font-medium">
                                                  Campaign Creating Tutorial
                                                  <p className="text-xs text-gray-500 font-medium mb-2">8 min</p>
                                             </h2>
                                        </div>
                                   </div>
                              </div>

                              {/* Button at last of the FAQs */}
                              <div className="flex items-center justify-center my-5 ">
                                   <button className="flex flex-row bg-green-500 cursor-pointer gap-x-2 p-2 items-center justify-center rounded-lg">
                                        <TfiHeadphone size={16} color="white" />
                                        <h2 className="font-medium text-sm text-white">Contact Support</h2>
                                   </button>
                              </div>
                         </div>
                    )
               }

               <div className="flex overflow-hidden h-screen">

                    {/* Sidebar at left side */}
                    <SideBar />

                    {/* Main content area with header and all main content */}
                    <div className='flex-1 flex flex-col overflow-hidden'>
                         <Header />

                         {/* Main Content after the header of the component */}
                         <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
                              <div className="max-w-7xl mx-auto">

                                   {/* Welcome message for Admin  */}
                                   <div className="flex flex-col">
                                        <div>
                                             <h2 className="font-medium text-2xl">
                                                  Welcome back, {user?.user?.first_name || user?.first_name || 'User'}
                                             </h2>
                                        </div>
                                        <div>
                                             <span className="text-gray-500 text-[14.5px]">
                                                  Here's what's happening with your WhatsApp campaigns today.
                                             </span>
                                        </div>
                                   </div>

                                   {/* Custom Cards for Admin Convinience*/}
                                   <div className="grid lg:grid-cols-4 my-10 gap-x-6">

                                        {/* Message Custom Card */}
                                        <DashboardCard
                                             cardIcon={
                                                  <RiMessage2Line size={23} color='#66BB6A' />
                                             }
                                             cardHeader={"Messages Sent"}
                                             cardFooter={"from last week"}
                                             cardInternalValue={"1,250"}
                                             iconBackgroundColor={"#d1fae5"}
                                             growthDownPercentage={"12.5%"}
                                        />

                                        {/* Dynamic Cards */}
                                        {
                                             completeData?.map((data, index) => {
                                                  const routeName = data?.apiRoute?.split("/").filter(Boolean)[0] || "unknown";
                                                  const formattedName = formatRouteName(data?.apiRoute);
                                                  const dataCount = getDataCount(data, routeName);

                                                  return (
                                                       <div key={index}>
                                                            {data.isLoading ? (
                                                                 <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                                                      <div className="flex items-center justify-center h-20">
                                                                           <div className="flex flex-col items-center gap-2">
                                                                                <Spinner size="small" />
                                                                                <span className="text-xs text-gray-500">Loading {formattedName.toLowerCase()}...</span>
                                                                           </div>
                                                                      </div>
                                                                 </div>
                                                            ) : data.error ? (
                                                                 <div className="bg-white rounded-lg p-6 shadow-sm border border-red-200">
                                                                      <div className="flex items-center justify-center h-20">
                                                                           <div className="text-center">
                                                                                <div className="text-red-500 mb-1">
                                                                                     <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                     </svg>
                                                                                </div>
                                                                                <span className="text-xs text-red-600">Failed to load {formattedName.toLowerCase()}</span>
                                                                           </div>
                                                                      </div>
                                                                 </div>
                                                            ) : (
                                                                 <DashboardCard
                                                                      cardIcon={
                                                                           formattedName === "Contacts" ?
                                                                                <FaUserFriends size={23} color="#FDD835" />
                                                                                : formattedName === "Templates" ?
                                                                                     <LuNewspaper size={23} color="indigo" /> :
                                                                                     <RiCheckDoubleLine size={23} color="#42A5F5" />
                                                                      }
                                                                      cardHeader={formattedName}
                                                                      cardFooter={"from last week"}
                                                                      cardInternalValue={dataCount}
                                                                      growthDownPercentage={"1.2%"}
                                                                      iconBackgroundColor={formattedName === "Templates" ? "#C5CAE9" : formattedName === "Contacts" ? "#FFF9C4" : "#dbeafe"}
                                                                 />
                                                            )}
                                                       </div>
                                                  );
                                             })
                                        }
                                   </div>

                                   {/* Quick Actions with Several Buttons */}
                                   <div className="flex flex-col space-y-5">
                                        <div>
                                             <h2 className="text-lg font-semibold">Quick Actions</h2>
                                        </div>

                                        {/* Custom Buttons with some styling */}
                                        <div className="items-center justify-center grid grid-cols-3 gap-x-5">

                                             {/* Send New Message Button with Link */}
                                             <CustomLinkButton
                                                  title={"Send New Message"}
                                                  buttonName={"sendNewMessageButton"}
                                                  href={"/compose-new-message"}
                                                  buttonIcon={
                                                       <RiSendPlaneLine size={15} color="#4CAF50" />
                                                  }
                                             />

                                             {/* Import Contacts Button */}
                                             <CustomLinkButton
                                                  title={"Import Contacts"}
                                                  buttonName={"sendNewMessageButton"}
                                                  href={"/import-contacts"}
                                                  buttonIcon={
                                                       <TbUserPlus size={15} color="#4CAF50" />
                                                  }
                                             />

                                             {/* Create New Template Button */}
                                             <CustomLinkButton
                                                  title={"New Template"}
                                                  buttonName={"sendNewMessageButton"}
                                                  href={"/templates/create-new-template"}
                                                  buttonIcon={
                                                       <BsFileEarmarkPlus size={15} color="#4CAF50" />
                                                  }
                                             />
                                        </div>
                                   </div>

                                   {/* Recent Messages Overview, with different messages */}
                                   <div className="flex flex-row justify-between items-start my-5 gap-x-5 ">
                                        {/* Card for Messages Overview */}
                                        <RecentMessages />

                                        {/* Card for Campagin */}
                                        <div className="p-5 bg-white w-[300px] rounded-xl h-auto ">
                                             <div className="flex flex-col">
                                                  <div className="flex flex-col gap-y-3">
                                                       <h2 className="text-lg font-semibold">Campaign Status</h2>
                                                       <hr className="text-gray-200 w-full" />
                                                  </div>

                                                  {/* Campaign Cards different sections */}
                                                  <CampaignCard
                                                       title={"Summer Sale Promotion"}
                                                       footer={"2342 / 3204 sent"}
                                                       progress={"90"}
                                                       status={"Active"}
                                                  />

                                                  <CampaignCard
                                                       title={"New Product Launch"}
                                                       footer={"Starts from July"}
                                                       progress={"0"}
                                                       status={"Scheduled"}
                                                  />

                                                  <CampaignCard
                                                       title={"Summer Sales"}
                                                       footer={"1856 / 1856 sent"}
                                                       progress={100}
                                                       status={"Completed"}
                                                  />

                                                  <CustomButton
                                                       title={"Create New Campaign"}
                                                       href={"/create-new-campaign"}
                                                       handleClick={() => console.log("")}
                                                  />
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

export default Dashboard