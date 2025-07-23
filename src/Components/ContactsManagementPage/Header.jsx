import React, { useState } from 'react'
import { BsQuestionCircle } from 'react-icons/bs';
import { FaArrowLeftLong, FaQ } from 'react-icons/fa6';
import { LuBellRing } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import CustomInput from '../customInput';
import { IoClose } from 'react-icons/io5';
import { AiOutlinePlaySquare } from 'react-icons/ai';
import { TfiHeadphone } from 'react-icons/tfi';
import FAQsCard from '../FAQsCard';
import { FaArrowRight } from 'react-icons/fa';
import NotificationCustomCard from '../notificationCustomCard';

const Header = () => {

     const [showNotifications, setShowNotifications] = useState(false);
     const [showFAQs, setShowFAQs] = useState(false);
     const [searchContacts, setSearchContacts] = useState("");
     const [changeFAQsSearchInput, setChangeFAQsSearchInput] = useState("");

     const handleShowFAQs = () => {
          setShowNotifications(false);
          setShowFAQs(true)
     }

     const handleShowNotifications = () => {
          setShowNotifications(true);
          setShowFAQs(false);
     }


     return (
          <>
               {
                    showFAQs &&
                    (
                         <FAQsCard
                              closeFAQs={() => setShowFAQs(false)}
                              changeFAQsSearchInput={changeFAQsSearchInput}
                              setChangeFAQsSearchInput={setChangeFAQsSearchInput}
                         />
                    )
               }

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
                    )
               }
               <header className="bg-white shadow-sm z-10">
                    <div className="flex flex-row items-center justify-between px-6 h-16">

                         <CustomInput
                              placeholder={"Search...."}
                              name={"searchContacts"}
                              value={searchContacts}
                              handleOnChange={(e) => setSearchContacts(e.target.value)} />

                         {/* Notification Icon, FAQs Ion works as buttons (Bell Icon, Quesion Icon) */}
                         <div className="flex flex-row items-center justify-between gap-10">
                              <div className="px-2 py-1 bg-green-100 rounded-full">
                                   <h2 className="text-green-700 text-xs font-semibold">
                                        Connected
                                   </h2>
                              </div>

                              {/* Notification button to show notifications*/}
                              <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer" onClick={handleShowNotifications}>
                                   <LuBellRing size={20} color="gray" />
                              </div>

                              {/* FAQs button to show common FAQs */}
                              <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer" onClick={handleShowFAQs}>
                                   <BsQuestionCircle size={20} color="gray" />
                              </div>
                         </div>
                    </div>
               </header>
          </>
     )
}

export default Header
