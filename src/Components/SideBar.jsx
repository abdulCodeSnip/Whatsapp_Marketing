import React, { useEffect, useState } from 'react'
import { FaHistory } from 'react-icons/fa'
import { IoNewspaperOutline, IoSettingsOutline } from 'react-icons/io5'
import { MdOutlineDashboard, MdEmail, MdLogout } from 'react-icons/md'
import { RiContactsBookLine, RiMessage2Line } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authenticatingUser } from '../redux/authentication/loginUser';
import { authUtils, handleLogout, authenticatedFetch } from '../utils/auth'

const SideBar = () => {
     const [showProfilePopup, setShowProfilePopup] = useState(false);

     const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
     const dispatch = useDispatch();
     const user = useSelector((state) => state?.loginUser?.userLogin);
     const navigate = useNavigate();

     // Authenticate user directly based on the email and password
     const authenticateUser = async () => {
          try {
               const credentials = authUtils.getUserCredentials();
               
               if (!credentials.email || !credentials.password) {
                    console.warn('Missing credentials for authentication');
                    handleLogout(navigate, dispatch);
                    return;
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

               const result = await apiResponse.json();
               dispatch(authenticatingUser(result?.user));
          } catch (error) {
               console.log("Authentication failed:", error);
               // If error is due to 401, user will already be logged out by authenticatedFetch
          }
     }

     const handleUserLogout = () => {
          handleLogout(navigate, dispatch);
     }

     useEffect(() => {
          authenticateUser();
     }, [])

     const { pathname } = useLocation();
     
     return (
          <div className="w-64 bg-gray-900 text-white flex flex-col">
               <div className="p-4 flex items-center border-b border-gray-800">
                    <span className="text-2xl text-white">
                         logo
                    </span>
               </div>
               <div className="flex-1 overflow-y-auto py-4">
                    <nav className="px-2 space-y-1">

                         {/* Dashboard Page Navigation Link */}
                         <Link to={"/"}
                              className={`flex items-center px-4 py-3 text-gray-300 transition-all text-sm font-medium rounded-md ${pathname === "/" ? "bg-gray-800 border-l-3 border-l-green-500" : "bg-gray-900"} hover:text-white hover:bg-gray-800`}
                         >
                              <div className="w-6 h-6 flex items-center justify-center mr-3">
                                   <MdOutlineDashboard size={20} />
                              </div>
                              Dashboard
                         </Link>

                         {/* Messages Page Navigation Link */}
                         <Link to={"/messages"}
                              className={`flex items-center px-4 transition-all py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 ${pathname === "/messages" ? "bg-gray-800 border-l-3 border-l-green-500" : "bg-gray-900"} hover:text-white`}
                         >
                              <div className="w-6 h-6 flex items-center justify-center mr-3">
                                   <RiMessage2Line size={20} />
                              </div>
                              Messages
                         </Link>

                         {/* Templates Page Navigation Link */}
                         <Link to={"/templates"}
                              className={`flex items-center px-4 py-3 transition-all text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white ${pathname === "/templates" || pathname === "/templates/create-new-template" ? "bg-gray-800 border-l-3 border-l-green-500" : "bg-gray-900"}`}
                         >
                              <div className="w-6 h-6 flex items-center justify-center mr-3">
                                   <IoNewspaperOutline size={20} />
                              </div>
                              Templates
                         </Link>

                         {/* Contacts Page Navigation Link */}
                         <Link to={"/contacts"}
                              className={`flex items-center px-4 py-3 text-sm transition-all font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white ${pathname === "/contacts" ? "bg-gray-800 border-l-3 border-l-green-500" : "bg-gray-900"}`}
                         >
                              <div className="w-6 h-6 flex items-center justify-center mr-3">
                                   <RiContactsBookLine size={20} />
                              </div>
                              Contacts
                         </Link>

                         {/* Chat History Page Navigation Link */}
                         <Link to={"/chat-history"}
                              className={`flex items-center px-4 py-3 text-sm transition-all font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white ${pathname === "/chat-history" ? "bg-gray-800 border-l-3 border-l-green-500" : "bg-gray-900"}`}
                         >
                              <div className="w-6 h-6 flex items-center justify-center mr-3">
                                   <FaHistory size={20} />
                              </div>
                              Chat History
                         </Link>

                         {/* Settings Page Navigation Link */}
                         <Link to={"/settings"}
                              className={`flex items-center px-4 py-3 text-sm transition-all font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white ${pathname === "/settings" ? "bg-gray-800 border-l-3 border-l-green-500" : "bg-gray-900"}`}
                         >
                              <div className="w-6 h-6 flex items-center justify-center mr-3">
                                   <IoSettingsOutline size={20} />
                              </div>
                              Settings
                         </Link>
                    </nav>
               </div>

               {/* Profile Section with Hover Popup, this section will be hoverable, so by hovering we'd see a dialog containing "user email" and "logout option" */}
               <div className="p-4 border-t border-gray-800 relative">
                    <div 
                         className="flex items-center cursor-pointer hover:bg-gray-800 rounded-lg p-2 transition-all duration-200"
                         // onMouseEnter={() => setShowProfilePopup(true)}
                         // onMouseLeave={() => setShowProfilePopup(false)}
                         onClick={() => setShowProfilePopup(!showProfilePopup)}
                    >
                         <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                              <span className="text-sm font-medium">
                                   {user?.first_name?.charAt(0).toUpperCase() + " " + user?.last_name?.charAt(0)?.toUpperCase()}
                              </span>
                         </div>
                         <div className="ml-3">
                              <p className="text-sm font-medium text-white">{user?.first_name + " " + user?.last_name}</p>
                              <p className="text-xs text-gray-400">{String (user?.role?.charAt(0).toUpperCase()) + String (user?.role?.slice(1)) }</p>
                         </div>
                    </div>

                    {/* Profile Popup, when we hover to the profile, this popup will show, containing "user email" and "logout" option */}
                    {showProfilePopup && (
                         <div 
                              className="absolute bottom-full left-4 right-4 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
                              // onMouseEnter={() => setShowProfilePopup(true)}
                              // onMouseLeave={() => setShowProfilePopup(false)}
                              onClick={() => setShowProfilePopup(!showProfilePopup)}
                         >
                              {/* Arrow pointing down, just a sticky style*/}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                   <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-800"></div>
                              </div>

                              <div className="p-3 space-y-2">
                                   {/* User Email, coming from redux store */}
                                   <div className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-all">
                                        <MdEmail size={16} className="mr-3 text-green-500" />
                                        <div>
                                             <p className="text-xs text-gray-400">Email</p>
                                             <p className="text-sm font-medium">{user?.email || Cookies.get("email") || "Not available"}</p>
                                        </div>
                                   </div>

                                   {/* Logout Button, logout the user and redirect that user to "login screen" */}
                                   <button
                                        onClick={handleUserLogout}
                                        className="w-full cursor-pointer flex items-center px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-all"
                                   >
                                        <MdLogout size={16} className="mr-3" />
                                        <span className="text-sm font-medium">Logout</span>
                                   </button>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     )
}

export default SideBar