import React from 'react'
import SideBar from '../Components/SideBar';
import Header from '../Components/ContactsManagementPage/Header';
import SettingSideBar from '../Components/SettingsPage/SettingSideBar';
import AccountSetting from '../Components/SettingsPage/AccountSetting';
import { useSelector } from 'react-redux';
import WhatsappConnectionSetting from '../Components/SettingsPage/WhatsappConnectionSetting';


const Settings = () => {

     const selectedButton = useSelector((state) => state?.selectedButton?.activeButton);
     console.log(selectedButton);

     return (
          <div className="flex overflow-hidden h-screen">
               {/* Sidebar at left side */}
               <SideBar />
               <div className="flex flex-1 flex-col overflow-hidden">
                    <Header />

                    {/* Main content with all the content */}
                    <main className="flex-1 flex flex-row gap-5 bg-gray-50 overflow-hidden">
                         <div className="sticky overflow-hidden">
                              <SettingSideBar />
                         </div>
                         <div className='p-6 w-full h-[100%]'>
                              {
                                   selectedButton === "Option-1" ?
                                        <AccountSetting /> : selectedButton === "Option-2" ? <WhatsappConnectionSetting /> : null
                              }
                         </div>
                    </main>
               </div>
          </div>
     )
}

export default Settings
