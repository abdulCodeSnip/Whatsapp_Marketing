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
import useFetchTemplates from '../hooks/useFetchTemplates';
import AllTemplatesTable from '../Components/TemplatesPage/AllTemplatesTable';

const Templates = () => {
     // the function "HandleSearchTemplates, works for sorting the templates based on "search value", "changing of options in Category", "changing of options in Status", and even, it can handle the "Reset Button to reset all filters, and return the total value, removing all the filters" "
     return (

          <>
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

                                   {/* Useful message for admin, and few icons */}
                                   <Hamburger firstLink={"Dashboard"} secondLink={"Templates"} />

                                   <AllTemplatesTable />
                              </div>
                         </main>
                    </div>
               </div>
          </>

     )
}

export default Templates
