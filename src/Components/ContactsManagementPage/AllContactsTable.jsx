import React, { useEffect, useState } from 'react'
import { BiDotsVertical, BiPencil, BiSearch } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CiImport } from 'react-icons/ci';
import { FaSearch } from 'react-icons/fa';
import { LuMessageSquareMore } from 'react-icons/lu';
import { RiSortAsc } from 'react-icons/ri';
import FooterPagination from '../footerPagination';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { changeSelectedContact } from '../../redux/chatHistoryPage/selectedContactConversation';

const AllContactsTable = ({ replyToMessage, editContact, actions }) => {

     const [searchContacts, setSearchContacts] = useState("");
     const [shouldNavigateToChat, setShouldNavigateToChat] = useState(false);
     const navigate = useNavigate()

     const [allContacts, setAllContacts] = useState([]);
     const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
     const currentSelectedContact = useSelector((state) => state?.selectedContact?.selectedContact);
     const dispatch = useDispatch();

     // Effect to handle navigation after contact selection
     useEffect(() => {
          if (shouldNavigateToChat && currentSelectedContact) {
               navigate(`/chat-history`);
               setShouldNavigateToChat(false);
          }
     }, [currentSelectedContact, shouldNavigateToChat, navigate]);

     const tableHead = [
          {
               id: "1",
               tableHeader: "checkbox",
          },
          {
               id: "2",
               tableHeader: "Contacts",
          },
          {
               id: "3",
               tableHeader: "Role",
          },
          {
               id: "4",
               tableHeader: "Last Interaction"
          },
          {
               id: "5",
               tableHeader: "Status",
          },
          {
               id: "6",
               tableHeader: "Actions"
          }
     ];

     // Get Current Date if there is not interaction date for the user is in the database?
     const dateObject = new Date();
     const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
     let currentDate = dateObject.getDate().toString() + " / " + months[(dateObject.getUTCMonth())] + " / " + dateObject.getFullYear().toString();

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

     const handleChatIconClick = (contact) => {
          dispatch(changeSelectedContact(contact));
          setShouldNavigateToChat(true);
     };

     const {pathname} = useLocation();
     useEffect(() => {
          getAllContacts();
     }, [pathname]);
     
     return (
          <div className='flex w-full flex-col space-y-5'>
               {/* Bulk Buttons for sorting and searching through contacts */}
               <div className='flex flex-row w-full justify-between bg-white p-3 shadow rounded-xl gap-x-4'>

                    {/* Search Contacts here */}
                    <div className="flex flex-row flex-[56%] relative">
                         <input
                              placeholder="Search Contacts....."
                              value={searchContacts}
                              onChange={(e) => setSearchContacts(e.target.value)}
                              className="border-1 border-gray-300 px-8 py-2 outline-green-500 text-sm rounded-xl w-full flex-2/3"
                         />
                         <BiSearch className='absolute top-3 left-2' size={15} color="gray" />
                    </div>

                    {/* Sort By Button */}
                    <div className='flex-1/3 flex w-full space-x-3'>
                         <button className='flex flex-row items-center justify-center gap-x-1 border-1 border-gray-300 px-3 py-1 rounded-lg font-medium text-gray-700 tracking-wider cursor-pointer focus:border-green-500 shadow-xs'>
                              <RiSortAsc />
                              <span>Sort By</span>
                         </button>
                         <button className="flex flex-row items-center justify-center gap-x-1 border-1 border-gray-300 px-3 py-1 rounded-lg font-medium text-gray-700 tracking-wider cursor-pointer focus:border-green-500 shadow-xs">
                              <CiImport />
                              <span>Export</span>
                         </button>

                         {/* This button will handle the "sending template message" */}
                         <button className="flex flex-row items-center justify-center gap-x-1 border-1 border-gray-300 px-3 py-2 rounded-lg font-medium text-gray-700 tracking-wider cursor-pointer focus:border-green-500 shadow-xs">
                              <BiDotsVertical />
                         </button>
                    </div>

               </div>

               {/* Table with Contacts */}
               <div className='bg-white rounded-lg shadow-sm overflow-hidden divide-y divide-gray-300'>
                    <div className="overflow-x-auto">
                         <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                   <tr>
                                        {
                                             tableHead.map((theader) => (
                                                  <th key={theader.id} scope="col" className="uppercase tracking-wider text-left font-medium text-gray-500 text-xs px-6 py-3">
                                                       {
                                                            theader.tableHeader === "checkbox" ?
                                                                 <>
                                                                      <label htmlFor="checkbox"></label>
                                                                      <input type="checkbox" id="checkbox" name="checkbox" className='accent-green-600 w-4 h-4 cursor-pointer border border-gray-300 outline-none' />
                                                                 </>
                                                                 :
                                                                 <>
                                                                      {
                                                                           theader.tableHeader
                                                                      }
                                                                 </>
                                                       }
                                                  </th>
                                             ))
                                        }
                                   </tr>
                              </thead>

                              <tbody>
                                   {
                                        allContacts?.users?.map((contact) => (
                                             <tr key={contact?.id}>

                                                  {/* First Checkbox */}
                                                  <td scope="col" className='px-6 py-4 whitespace-nowrap'>
                                                       <label htmlFor={contact?.id}>
                                                       </label>
                                                       <input type="checkbox" id={contact?.id} className='accent-green-600 w-4 h-4 cursor-pointer' />
                                                  </td>

                                                  {/* Contacts Avatar */}
                                                  <td scope="col" className='px-6 py-4 whitespace-nowrap'>
                                                       <div className='flex flex-row items-center justify-start gap-x-2'>
                                                            <div className={`tracking-wide items-center justify-center flex text-sm w-10 h-10 font-medium p-2 border-1 border-gray-300 shadow-sm rounded-full text-gray-700`}>
                                                                 <span className={``}>
                                                                      {
                                                                           contact.first_name?.charAt(0).toUpperCase() + " " + contact?.last_name?.charAt(0).toUpperCase()
                                                                      }
                                                                 </span>
                                                            </div>
                                                            <div className='flex flex-col'>
                                                                 <span
                                                                      className='text-gray-900 font-medium text-sm'>
                                                                      {contact?.first_name + " " + contact?.last_name}</span>
                                                                 <span className='text-gray-500 text-sm'>{contact?.phone}</span>
                                                            </div>
                                                       </div>
                                                  </td>
                                                  <td scope='col' className='px-6 py-4 whitespace-nowrap'>
                                                       <div className={`flex flex-row items-center justify-center text-xs font-medium tracking-wide px-2 py-1 rounded-full ${contact?.role?.toLowerCase() === "admin" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-600"}`}>
                                                            {contact?.role?.charAt(0).toUpperCase() + contact?.role?.slice(1)}
                                                       </div>
                                                  </td>

                                                  {/* Last Interaction Data */}
                                                  <td scope='col' className='px-6 py-4 whitespace-nowrap'>
                                                       <div>
                                                            <span className='text-sm text-gray-500'>{contact?.last_contacted || currentDate}</span>
                                                       </div>
                                                  </td>

                                                  {/* Contact Status */}
                                                  <td scope='col' className='px-6 py-4 whitespace-nowrap'>
                                                       <div className={`font-medium text-[12px] py-1 px-2 rounded-full flex items-center justify-center ${contact?.status?.toLowerCase() === "active" ? "bg-green-100 text-green-800" : contact.contactStatus?.toLowerCase() === "inactive" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                                                            <span>{contact?.status?.charAt(0).toUpperCase() + contact?.status?.slice(1)}</span>
                                                       </div>
                                                  </td>

                                                  {/* Actions Buttons for contacts */}
                                                  <td scope='col' className="px-6 py-4 whitespace-nowrap">
                                                       <div className="flex flex-row items-center justify-between gap-x-2">

                                                            {/* Pressed on this icons and a dialog for replay would open */}
                                                            <button onClick={() => handleChatIconClick(contact)} className='cursor-pointer p-2 rounded-full hover:text-green-400 text-gray-500 hover:bg-gray-100 transition-all'>
                                                                 <LuMessageSquareMore size={18} />
                                                            </button>
                                                            {/* Pressed on this Icon and a dialog for editing a contact would open */}
                                                            <button onClick={() => navigate(`/contacts/${contact?.id}`)} className='cursor-pointer p-2 rounded-full hover:text-green-400 text-gray-500 hover:bg-gray-100 transition-all'>
                                                                 <BiPencil size={18} />
                                                            </button>

                                                            <button onClick={() => console.log(contact)} className='cursor-pointer p-2 rounded-full hover:text-green-400 text-gray-500 hover:bg-gray-100 transition-all'>
                                                                 <BsThreeDotsVertical size={18} />
                                                            </button>
                                                       </div>
                                                  </td>
                                             </tr>
                                        ))
                                   }
                              </tbody>
                         </table>
                    </div>
                    <div className='flex p-5 text-gray-900 text-sm justify-between flex-row'>
                         <span>Showing <span className='text-gray-900 font-medium text-sm'>1</span> to <span className='text-gray-900 font-medium text-sm'>{allContacts?.length}</span> of <span className='text-gray-900 font-medium text-sm'>{allContacts?.length}</span> results</span>
                         <FooterPagination />
                    </div>
               </div>
          </div>
     )
}

export default AllContactsTable