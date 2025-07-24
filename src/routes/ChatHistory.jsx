import React from 'react'
import { MdOutlineDashboard, MdArticle } from "react-icons/md";
import { RiMessage2Line, RiContactsBookLine, RiCheckDoubleLine, RiSendPlaneLine } from "react-icons/ri";
import { IoNewspaperOutline, IoSettingsOutline, IoClose } from "react-icons/io5";
import { FaHistory, FaSearch } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { BsQuestionCircle, BsFileEarmarkPlus } from "react-icons/bs";
import { LuBellRing } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { TbUserPlus } from "react-icons/tb";
import { FaArrowRight } from "react-icons/fa6";
import { Link, useLocation } from 'react-router-dom';
import CustomInput from '../Components/customInput';
import DashboardCard from '../Components/dashboardCard';
import CustomLinkButton from '../Components/customLinkButton';
import MessageCard from '../Components/messageCard';
import CampaignCard from '../Components/campaignCard';
import CustomButton from '../Components/customButton';
import NotificationCustomCard from '../Components/notificationCustomCard';
import { AiOutlinePlaySquare } from "react-icons/ai";
import { BiDotsVertical, BiVideo } from 'react-icons/bi';
import ClickableCustomButton from '../Components/clickableCustomButton';
import { TfiHeadphone } from 'react-icons/tfi';
import SideBar from '../Components/SideBar';
import Header from '../Components/ContactsManagementPage/Header';
import ConversationSidebar from '../Components/ChatsHistory/ConversationSidebar';
import ReceiverHeader from '../Components/ChatsHistory/ReceiverHeader';
import Chats from '../Components/ChatsHistory/Chats';
import { useSelector } from 'react-redux';
import ChatFooter from '../Components/ChatsHistory/ChatFooter';


const ChatHistory = () => {

     const selectedContact = useSelector((state) => state?.selectedContact?.selectedContact);
     return (
          <div className="flex overflow-hidden h-screen">
               {/* Sidebar at left side */}
               <SideBar />

               {/* Main content */}
               <div className='flex-1 flex flex-col overflow-hidden'>
                    <Header />
                    <main className="flex-1 overflow-y-auto bg-gray-100">
                         <div className="max-w-7xl mx-auto h-[100%] flex flex-row">
                              <ConversationSidebar />
                              {selectedContact?.length !== 0 &&
                                   (<div className='w-full flex flex-col overflow-y-auto space-y-3'>
                                        <ReceiverHeader />
                                        <Chats />
                                   </div>)
                              }
                         </div>
                    </main>
               </div>
          </div>
     )
}

export default ChatHistory
