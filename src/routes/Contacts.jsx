import { TbLayoutDashboard } from "react-icons/tb";
import Header from "../Components/ContactsManagementPage/Header";
import SideBar from "../Components/SideBar";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight, MdOutlinePersonAdd } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import AllContactsTable from "../Components/ContactsManagementPage/AllContactsTable";
import { useEffect, useState } from "react";
import AddContactsDialog from "../Components/ContactsManagementPage/AddContactsDialog";
import { useDispatch, useSelector } from "react-redux";
import { LuUsersRound } from "react-icons/lu";


const Contacts = () => {
     const [showAddContactDialog, setShowAddContactDialog] = useState(false);
     const [isContactSaved, setIsContactSaved] = useState(false);
     const [editContact, setEditContact] = useState(false);
     const [replyToMessage, setReplyToMessage] = useState(false);
     const [allContacts, setAllContacts] = useState([]);
     const [refreshContacts, setRefreshContacts] = useState(false);

     // Values from Redux
     const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
     const errorMessage = useSelector((state) => state?.errorMessage?.message);

     const navigate = useNavigate();

     // Fetch all the existing contacts inside the database
     const getAllContacts = async () => {
          try {
               const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
                    method: "GET",
                    headers: {
                         "Authorization": authInformation?.token
                    },
               });
               const result = await apiResponse.json();
               setAllContacts(result);
          } catch (error) {
               console.log(error);
          }
     }

     useEffect(() => {
          getAllContacts();
     }, [refreshContacts])

     const handleContactSaved = () => {
          setShowAddContactDialog(false);
          setIsContactSaved(true);
          setRefreshContacts(prev => !prev); // Trigger refresh
          setTimeout(() => {
               setIsContactSaved(false);
          }, 3000);
     };

     return (
          <div className="flex overflow-hidden h-screen">
               {/* SideBar At Left Side */}
               <SideBar />

               {/* Main Content With Header and actual content */}
               <div className="flex flex-1 flex-col overflow-hidden">
                    <Header />

                    {/* Main content just after the header */}

                    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                         <div className="max-w-7xl mx-auto">
                              {/* A Small Hamburger */}
                              <div className="flex flex-row gap-x-5">
                                   <div className="flex flex-row gap-x-2">
                                        <Link to={"/"} className="text-gray-400 hover:text-gray-700 transition-all flex flex-row items-center gap-x-2 text-sm font-medium">
                                             <TbLayoutDashboard size={17} />
                                             <span>Dashboard</span>
                                        </Link>
                                        <div className="text-gray-500 hover:text-gray-700 transition-all flex flex-row items-center gap-x-2 text-sm font-medium">
                                             <MdKeyboardArrowRight size={17} />
                                             <span className="text-gray-700">Contacts</span>
                                        </div>
                                   </div>
                              </div>

                              {/* Title and some buttons for fast accessablilty */}
                              <div className="flex flex-row items-center justify-between mt-5">

                                   {/* Title */}
                                   <div className="flex flex-col items-start justify-center space-y-2">
                                        <h2 className="text-2xl font-bold text-gray-900">Contacts</h2>
                                        <p className="text-sm text-gray-500">Manage your WhatsApp contacts and groups</p>
                                   </div>

                                   {/* Buttons for Quick Actions */}
                                   <div className="flex flex-row items-center justify-center gap-x-5">

                                        {/* Add Contacts Button */}
                                        <button
                                             onClick={() => {
                                                  setShowAddContactDialog(true);
                                             }}
                                             className="flex flex-row items-center justify-center gap-x-1 px-4 py-2 bg-green-500 shadow-sm text-gray-100 rounded-lg cursor-pointer text-sm font-medium">
                                             <MdOutlinePersonAdd size={18} />
                                             <span>Add Contact</span>
                                        </button>

                                        {/* Import Contacts Button */}
                                        <button
                                             onClick={() => navigate("/import-contacts")}
                                             className="flex flex-row items-center justify-center gap-x-1 px-4 py-2 bg-white shadow-sm text-gray-600 border cursor-pointer border-gray-400 rounded-lg text-sm font-medium">
                                             <FiUpload size={18} />
                                             <span>Import CSV</span>
                                        </button>
                                   </div>
                              </div>

                              <div className="flex flex-row gap-x-4 justify-between mt-5">
                                   <div className="flex flex-col px-3 space-y-3 py-2 w-full">
                                        <h2 className="font-medium text-lg">Contacts</h2>
                                        <div className="bg-green-100 border-l-3 border-l-green-500 border-r-3 border-r-green-500 cursor-pointer flex items-center justify-between px-4 py-2 rounded-lg">
                                             <div className="flex flex-row gap-x-2">
                                                  <LuUsersRound />
                                                  <span className="font-medium text-sm text-gray-800">All Contacts</span>
                                             </div>
                                             <span className="font-medium text-sm p-2 rounded-full bg-green-200">
                                                  {allContacts?.users?.length || 0}
                                             </span>
                                        </div>
                                   </div>
                                   {/* All contacts would be fetched through this div */}
                                   <div className="w-full flex-col">
                                        <AllContactsTable 
                                             editContact={() => setEditContact(true)} 
                                             replyToMessage={() => setReplyToMessage(true)}
                                             allContacts={allContacts}
                                             onContactsChange={setAllContacts}
                                        />
                                   </div>
                              </div>

                              {/* A sample div for dimming background */}
                              {
                                   showAddContactDialog &&
                                   <div className="fixed inset-0 bg-black/50 bg-opacity-20 z-40">
                                        {/* This div is just for dimming the background if delete messages dialog is opened, otherwise the background would be smooth */}
                                   </div>
                              }

                              {/* If Contact has been save, then we just show a Popup */}
                              {
                                   isContactSaved &&
                                   <div className={`fixed top-20 right-8 rounded-l-2xl rounded-tr-2xl ${errorMessage?.type === "Success" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"} shadow-xl font-medium text-sm z-30 p-3`}>
                                        <h2>{errorMessage?.content}</h2>
                                   </div>
                              }

                              {/* if the "Add Contact" was pressed, this dialog would be shown here */}
                              {
                                   showAddContactDialog &&
                                   (
                                        <div className='fixed top-0 z-50 h-auto right-88 bg-white rounded-2xl border-gray-200 border-1 w-[550px] shadow-gray-200'>
                                             <AddContactsDialog
                                                  title={"Add New Contact"}
                                                  saveContact={handleContactSaved}
                                                  closeDialog={() => setShowAddContactDialog(false)}
                                             />
                                        </div>
                                   )
                              }
                         </div>

                    </main>
               </div>
          </div>
     )
}

export default Contacts
