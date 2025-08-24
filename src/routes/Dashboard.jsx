import React, { useEffect, useState } from 'react'
import dotenv from "dotenv";
import { RiMessage2Line, RiCheckDoubleLine, RiSendPlaneLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
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
import Cookies from 'js-cookie';

const Dashboard = () => {
     const [showFAQs, setShowFAQs] = useState(false);
     const [showNotifications, setShowNotifications] = useState(false);
     const [changeFAQsSearchInput, setChangeFAQsSearchInput] = useState("");
     const [user, setUser] = useState(null);
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState(null);
     
     const allUsers = useSelector((state) => state.allContacts?.allContacts?.at(0));

     // Values from Redux
     const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
     const allTemplates = useSelector((state) => state?.allTemplates?.allTemplates);

     const dispatch = useDispatch();

     // all data from apis
     const [completeData, setCompleteData] = useState([
          {
               apiRoute: "/contacts",
               apiData: [],
          },
          {
               apiRoute: "/templates",
               apiData: []
          }
     ]);

     // Get JWT token from cookies
     const getAuthToken = () => {
          return Cookies.get("jwtToken");
     };

     // Fetch data from APIs
     const fetchAllData = async () => {
          try {
               setIsLoading(true);
               setError(null);
               
               const token = getAuthToken();
               
               if (!token) {
                    throw new Error('No authentication token found');
               }

               const updatedData = await Promise.all(
                    completeData.map(async (item) => {
                         const response = await fetch(`${import.meta.env.VITE_API_URL}${item.apiRoute}`, {
                              method: "GET",
                              headers: {
                                   "Authorization": `Bearer ${token}`, // Fixed: Added Bearer prefix
                                   "Content-Type": "application/json"
                              },
                         });

                         if (!response.ok) {
                              throw new Error(`Failed to fetch ${item.apiRoute}: ${response.status}`);
                         }

                         const result = await response.json();

                         return {
                              ...item,
                              apiData: result,
                         };
                    })
               );

               setCompleteData(updatedData);
               
               // Dispatch to Redux store
               const templatesData = updatedData.find(item => item.apiRoute === "/templates")?.apiData?.templates;
               const contactsData = updatedData.find(item => item.apiRoute === "/contacts")?.apiData?.users;
               
               if (templatesData) {
                    dispatch(addTemplates(templatesData));
               }
               
               if (contactsData) {
                    dispatch(allContacts(contactsData));
               }
               
          } catch (error) {
               console.error("Error fetching data:", error);
               setError(error.message);
          } finally {
               setIsLoading(false);
          }
     };

     // Fetch user data such as username, email and password
     const userData = async () => {
          try {
               const token = getAuthToken();
               const email = Cookies.get("email");
               const password = Cookies.get("password");
               
               if (!token || !email || !password) {
                    throw new Error('Missing authentication credentials');
               }

               const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                    method: "POST",
                    headers: {
                         "Authorization": `Bearer ${token}`, // Fixed: Added Bearer prefix
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password })
               });
               
               if (!apiResponse.ok) {
                    throw new Error(`Failed to fetch user data: ${apiResponse.status}`);
               }
               
               const result = await apiResponse.json();
               setUser(result);
               
          } catch (error) {
               console.error("Error fetching user data:", error);
               setError(error.message);
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
     if (isLoading) {
          return (
               <div className="flex overflow-hidden h-screen">
                    <SideBar />
                    <div className='flex-1 flex flex-col overflow-hidden'>
                         <Header />
                         <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
                              <div className="max-w-7xl mx-auto">
                                   <div className="flex items-center justify-center h-64">
                                        <div className="text-lg text-gray-600">Loading dashboard data...</div>
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
                                        <div className="text-lg text-red-600">Error: {error}</div>
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
                                             <h2 className="font-medium text-2xl">Welcome back, {user?.user?.first_name || 'User'}</h2>
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
                                                  const routeName = data?.apiRoute?.split("/").filter(Boolean)[0];
                                                  const formattedName = routeName
                                                       ? routeName.charAt(0).toUpperCase() + routeName.slice(1)
                                                       : "Unknown";

                                                  const internalArray = Object.values(data.apiData)?.[0]; // <- dynamic "users" or "templates"
                                                  const internalLength = Array.isArray(internalArray) ? internalArray.length : 0;

                                                  return (
                                                       <div key={index}>
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
                                                                 cardInternalValue={internalLength}
                                                                 growthDownPercentage={"1.2%"}
                                                                 iconBackgroundColor={formattedName === "Templates" ? "#C5CAE9" : formattedName === "Contacts" ? "#FFF9C4" : "#dbeafe"}
                                                            />
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
                                                  href={"/messages"}
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