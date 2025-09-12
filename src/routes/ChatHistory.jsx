import React, { useState } from 'react';
import SideBar from '../Components/SideBar';
import Header from '../Components/ContactsManagementPage/Header';
import ConversationSidebar from '../Components/ChatsHistory/ConversationSidebar';
import ReceiverHeader from '../Components/ChatsHistory/ReceiverHeader';
import Chats from '../Components/ChatsHistory/Chats';
import { useSelector } from 'react-redux';

const ChatHistory = () => {
     const [sidebarOpen, setSidebarOpen] = useState(false);
     const selectedContact = useSelector((state) => state?.selectedContact?.selectedContact);
     return (
          <div className="flex overflow-hidden h-screen">
               {/* Sidebar at left side */}
               <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

               {/* Main content */}
               <div className='flex-1 flex flex-col overflow-hidden'>
                    <Header onMenuClick={() => setSidebarOpen(true)} />
                    <main className="flex-1 overflow-y-auto bg-gray-100">
                         <div className="max-w-7xl mx-auto h-[100%] flex flex-row">
                              <ConversationSidebar />
                              {selectedContact?.length !== 0 &&
                                   (<div className='w-full flex flex-col overflow-y-auto space-y-3'>
                                        <ReceiverHeader selectedContact={selectedContact} />
                                        <Chats selectedContact={selectedContact} />
                                   </div>)
                              }
                         </div>
                    </main>
               </div>
          </div>
     )
}

export default ChatHistory
