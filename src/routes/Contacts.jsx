import { TbLayoutDashboard } from "react-icons/tb";
import Header from "../Components/ContactsManagementPage/Header";
import SideBar from "../Components/SideBar";
import { Link } from "react-router-dom";
import { MdKeyboardArrowRight, MdOutlinePersonAdd } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { RiGroupLine } from "react-icons/ri";
import ContactGroupCard from "../Components/ContactsManagementPage/ContactGroupCard";
import AllContactsTable from "../Components/ContactsManagementPage/AllContactsTable";
import { useState } from "react";
import AddContactsDialog from "../Components/ContactsManagementPage/AddContactsDialog";
import { CgClose } from "react-icons/cg";
import ImportContactsDialog from "../Components/ContactsManagementPage/ImportContactsDialog";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import CreateGroupDialog from "../Components/ContactsManagementPage/CreateGroupDialog";
import { GiCheckMark } from "react-icons/gi";
import { useSelector } from "react-redux";


const Contacts = () => {
     const [showAddContactDialog, setShowAddContactDialog] = useState(false);
     const [isContactSaved, setIsContactSaved] = useState(false);
     const [showImportContactsDialog, setShowImportContactsDialog] = useState(false);
     const [isContactImported, setIsContactImported] = useState(false);
     const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
     const [isGroupCreated, setIsGroupCreated] = useState(false);
     const [editContact, setEditContact] = useState(false);
     const [replyToMessage, setReplyToMessage] = useState(false);
     const users = useSelector((state) => state?.allContacts?.allContacts);


     const addNewContact = async () => {
          try {
               const apiResponse = await fetch("http://localhost:3000/auth/register", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ first_name: "Abdul", last_name: "Qadeer", email: "azbcs4th@gmail.com", phone: "+92 312 9229373", password: "azbcs4th@gmail.com", role: "admin" })
               });
               const result = await apiResponse.json();
               console.log(result);
          } catch (error) {
               console.log(error.message);
          }
     }


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
                                                  addNewContact();
                                             }}
                                             className="flex flex-row items-center justify-center gap-x-1 px-4 py-2 bg-green-500 shadow-sm text-gray-100 rounded-lg cursor-pointer text-sm font-medium">
                                             <MdOutlinePersonAdd size={18} />
                                             <span>Add Contact</span>
                                        </button>

                                        {/* Import Contacts Button */}
                                        <button
                                             onClick={() => setShowImportContactsDialog(true)}
                                             className="flex flex-row items-center justify-center gap-x-1 px-4 py-2 bg-white shadow-sm text-gray-600 border cursor-pointer border-gray-400 rounded-lg text-sm font-medium">
                                             <FiUpload size={18} />
                                             <span>Import CSV</span>
                                        </button>

                                        {/* Create Group for Contacts "Button" */}
                                        <button
                                             onClick={() => setShowCreateGroupDialog(true)}
                                             className="flex flex-row items-center justify-center gap-x-1 px-4 py-2 bg-white text-gray-600 shadow-sm border cursor-pointer border-gray-400 rounded-lg text-sm font-medium">
                                             <RiGroupLine size={18} />
                                             <span>Create Group</span>
                                        </button>
                                   </div>
                              </div>

                              <div className="flex flex-row gap-x-4 justify-between mt-5">
                                   <div className="flex flex-col flex-1/3">
                                        <ContactGroupCard />
                                   </div>

                                   {/* All contacts would be fetched through this div */}
                                   <div className="w-full flex-col">
                                        <AllContactsTable editContact={() => setEditContact(true)} replyToMessage={() => setReplyToMessage(true)} />
                                   </div>
                              </div>

                              {/* A sample div for dimming background */}
                              {
                                   showAddContactDialog &&
                                   <div className="fixed inset-0 bg-black/50 bg-opacity-20 z-40">
                                        {/* This div is just for dimming the background if delete messages dialog is opened, otherwise the background would be smooth */}
                                   </div>
                              }

                              {/* Iif Contact has been save, then we just show a Popup */}
                              {
                                   isContactSaved &&
                                   <div className="fixed top-20 right-8 rounded-l-2xl rounded-tr-2xl bg-green-200 text-green-800 shadow-sm font-medium text-sm z-30 p-3">
                                        <h2>Contact saved successfully</h2>
                                   </div>
                              }

                              {/* if the "Add Contact" was pressed, this dialog would be shown here */}
                              {
                                   showAddContactDialog &&
                                   (
                                        <div className='fixed top-0 z-50 h-auto right-88 bg-white rounded-2xl border-gray-200 border-1 w-[550px] shadow-gray-200'>
                                             <AddContactsDialog
                                                  title={"Add New Contact"}
                                                  saveContact={() => {
                                                       setShowAddContactDialog(false);
                                                       setIsContactSaved(true);
                                                       setTimeout(() => {
                                                            setIsContactSaved(false);
                                                       }, 3000)
                                                  }}
                                                  closeDialog={() => setShowAddContactDialog(false)}
                                             />
                                        </div>
                                   )
                              }

                              {/* if "Import Contacts" was pressed, this dialog would be shown on the screen */}
                              {
                                   showImportContactsDialog &&
                                   <div className="fixed inset-0 bg-black/50 bg-opacity-20 z-40">
                                        {/* This div is just for dimming the background if delete messages dialog is opened, otherwise the background would be smooth */}
                                   </div>
                              }

                              {/* Import Contacts Dialog to recieve Contacts from the CSV file */}
                              {
                                   showImportContactsDialog &&
                                   (
                                        <div className="fixed top-0 z-50 h-[100%] left-100 bg-white rounded-2xl border-gray-200 border-1 w-[450px] shadow-gray-200">
                                             <ImportContactsDialog
                                                  closeDialog={() => setShowImportContactsDialog(false)}
                                                  contactsImported={() => {
                                                       setIsContactImported(true);
                                                       setTimeout(() => {
                                                            setIsContactImported(false);
                                                       }, 5000)
                                                  }}

                                             />
                                        </div>
                                   )
                              }

                              {/* A Success message, only if contacts are imported successfully from CSV file */}
                              {
                                   isContactImported &&
                                   (
                                        <div className="bg-green-100 flex flex-row justify-between items-center text-center text-green-700 fixed top-20 gap-x-1 right-10 text-sm z-20 font-normal p-4 rounded-l-2xl rounded-tr-2xl shadow-sm border-[0.5] border-gray-300">
                                             <div className="rounded-full border-green-700 p-[2px]">
                                                  <IoMdCheckmarkCircleOutline size={16} />
                                             </div>
                                             <p>
                                                  Contacts imported successfully from CSV file...
                                             </p>
                                             <button onClick={() => setIsContactImported(false)} className="p-2 rounded-full hover:bg-green-200 transition-all cursor-pointer">
                                                  <CgClose size={16} />
                                             </button>
                                        </div>
                                   )
                              }

                              {/* If "Create Group" is pressed this dialog would be shown on the screen */}
                              {
                                   showCreateGroupDialog &&
                                   (
                                        <div className="fixed top-0 right-90 items-center rounded-xl shadow-sm bg-white z-50 w-[450px] h-[100%]">
                                             <CreateGroupDialog
                                                  closeDialog={() => setShowCreateGroupDialog(false)}
                                                  submitGroup={() => {
                                                       setIsGroupCreated(true);
                                                       setShowCreateGroupDialog(false);
                                                       setTimeout(() => {
                                                            setIsGroupCreated(false);
                                                       }, [50000])
                                                  }}
                                             />
                                        </div>
                                   )
                              }

                              {
                                   showCreateGroupDialog && (
                                        <div className="fixed z-40 inset-0 bg-black/50 bg-opacity-20">
                                             {/* A div to focus on the dialog */}
                                        </div>
                                   )
                              }

                              {/* if Group is created and submitted successfully, a Popup message would be shown to the user */}
                              {
                                   isGroupCreated && (
                                        <div className="fixed right-10 top-20 text-green-600 space-x-2 z-40 px-3 py-2 text-sm shadow-sm flex flex-row justify-between bg-green-100 rounded-l-xl rounded-tr-xl border border-gray-300">
                                             <div className="flex flex-row gap-x-2 items-center justify-center">
                                                  <div className="p-[2px] rounded-full border border-green-600">
                                                       <GiCheckMark size={10} />
                                                  </div>
                                                  <div>
                                                       <span>New Group has been created successfully</span>
                                                  </div>
                                             </div>
                                             <button className="hover:bg-green-200 p-[2px] rounded-full cursor-pointer" onClick={() => setIsGroupCreated(false)}>
                                                  <CgClose size={15} />
                                             </button>
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
