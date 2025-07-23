import React, { useEffect, useState } from 'react'
import { FaHistory } from 'react-icons/fa'
import { IoNewspaperOutline, IoSettingsOutline } from 'react-icons/io5'
import { MdOutlineDashboard } from 'react-icons/md'
import { RiContactsBookLine, RiMessage2Line } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { authenticatingUser } from '../redux/authentication/loginUser';
import Cookies from 'js-cookie'

const SideBar = () => {

     const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
     const dispatch = useDispatch();
     const user = useSelector((state) => state?.loginUser?.userLogin);
     const authenticateUser = async () => {
          try {
               const apiResponse = await fetch(`${authInformation?.baseURL}/auth/login`, {
                    method: "POST",
                    headers: {
                         "Authorization": authInformation?.token,
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                         email: Cookies.get("email"),
                         password: Cookies.get("password")
                    })
               });

               const result = await apiResponse.json();
               dispatch(authenticatingUser(result?.user));
          } catch (error) {
               console.log("Something's wrong happend at the backend!", error);
          }
     }
     useEffect(() => {
          authenticateUser();
     }, [])

     console.log(Cookies.get("email"));
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
                              className={`flex items-center px-4 py-3 text-gray-300 transition-all text-sm font-medium rounded-md ${pathname === "/" ? "bg-gray-800" : "bg-gray-900"} hover:text-white hover:bg-gray-800`}
                         >
                              <div className="w-6 h-6 flex items-center justify-center mr-3">
                                   <MdOutlineDashboard size={20} />
                              </div>
                              Dashboard
                         </Link>

                         {/* Messages Page Navigation Link */}
                         <Link to={"/messages"}
                              className={`flex items-center px-4 transition-all py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 ${pathname === "/messages" ? "bg-gray-800" : "bg-gray-900"} hover:text-white`}
                         >
                              <div className="w-6 h-6 flex items-center justify-center mr-3">
                                   <RiMessage2Line size={20} />
                              </div>
                              Messages
                         </Link>

                         {/* Templates Page Navigation Link */}
                         <Link to={"/templates"}
                              className={`flex items-center px-4 py-3 transition-all text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white ${pathname === "/templates" || pathname === "/templates/create-new-template" ? "bg-gray-800" : "bg-gray-900"}`}
                         >
                              <div className="w-6 h-6 flex items-center justify-center mr-3">
                                   <IoNewspaperOutline size={20} />
                              </div>
                              Templates
                         </Link>

                         {/* Contacts Page Navigation Link */}
                         <Link to={"/contacts"}

                              className={`flex items-center px-4 py-3 text-sm transition-all font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white ${pathname === "/contacts" ? "bg-gray-800" : "bg-gray-900"}`}
                         >
                              <div className="w-6 h-6 flex items-center justify-center mr-3">
                                   <RiContactsBookLine size={20} />
                              </div>
                              Contacts
                         </Link>

                         {/* Chat History Page Navigation Link */}
                         <Link to={"/chat-history"}
                              className={`flex items-center px-4 py-3 text-sm transition-all font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white ${pathname === "/chat-history" ? "bg-gray-800" : "bg-gray-900"}`}
                         >
                              <div className="w-6 h-6 flex items-center justify-center mr-3">
                                   <FaHistory size={20} />
                              </div>
                              Chat History
                         </Link>

                         {/* Settings Page Navigation Link */}
                         <Link to={"/settings"}
                              className={`flex items-center px-4 py-3 text-sm transition-all font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white ${pathname === "/settings" ? "bg-gray-800" : "bg-gray-900"}`}
                         >
                              <div className="w-6 h-6 flex items-center justify-center mr-3">
                                   <IoSettingsOutline size={20} />
                              </div>
                              Settings
                         </Link>
                    </nav>
               </div>
               <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center">
                         <div
                              className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white"
                         >
                              <span className="text-sm font-medium">{user?.first_name?.charAt(0).toUpperCase() + " " + user?.last_name?.charAt(0)?.toUpperCase()}</span>
                         </div>
                         <div className="ml-3">
                              <p className="text-sm font-medium text-white">{user?.first_name + " " + user?.last_name}</p>
                              <p className="text-xs text-gray-400">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</p>
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default SideBar
