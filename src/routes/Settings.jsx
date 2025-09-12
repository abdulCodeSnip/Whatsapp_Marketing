import React, { useState } from 'react'
import SideBar from '../Components/SideBar';
import Header from '../Components/ContactsManagementPage/Header';
import SettingSideBar from '../Components/SettingsPage/SettingSideBar';
import AccountSetting from '../Components/SettingsPage/AccountSetting';
import { useSelector } from 'react-redux';
import WhatsappConnectionSetting from '../Components/SettingsPage/WhatsappConnectionSetting';


const Settings = () => {
     const [sidebarOpen, setSidebarOpen] = useState(false);
     const user = useSelector((state) => state?.loginUser?.userLogin);

     const selectedButton = useSelector((state) => state?.selectedButton?.activeButton);

     return (
          <div className="flex  min-h-screen">
               {/* Sidebar at left side */}
               <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
               <div className="flex flex-1 flex-col overflow-hidden">
                    <Header onMenuClick={() => setSidebarOpen(true)} />

                    {/* Main content with all the content */}
                    <main className="flex-1 flex flex-row gap-5 bg-gray-50  max-lg:flex-col max-lg:gap-y-2">
                         <div className="sticky overflow-hidden">
                              <SettingSideBar />
                         </div>
                         <div className='p-6 w-full h-[100%]'>
                              {
                                   selectedButton === "Option-1" ?
                                        <AccountSetting /> : selectedButton === "Option-2"
                                             &&
                                             user?.role?.toLowerCase() === "admin" ?
                                             <WhatsappConnectionSetting /> : null
                              }
                         </div>
                    </main>
               </div>
          </div>
     )
}

export default Settings
