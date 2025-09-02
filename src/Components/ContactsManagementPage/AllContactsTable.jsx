import React, { useEffect, useState, useMemo, useRef } from 'react'
import { BiDotsVertical, BiPencil, BiSearch } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CiImport } from 'react-icons/ci';
import { FaSearch } from 'react-icons/fa';
import { LuMessageSquareMore } from 'react-icons/lu';
import { RiSortAsc } from 'react-icons/ri';
import FooterPagination from '../footerPagination';
import FilterCard from '../filterCard';
import Spinner from '../Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { changeSelectedContact } from '../../redux/chatHistoryPage/selectedContactConversation';

const AllContactsTable = ({ 
     replyToMessage, 
     editContact, 
     actions, 
     allContacts: propAllContacts, 
     onContactsChange, 
     isLoading = false, 
     isError = false 
}) => {

     const [searchContacts, setSearchContacts] = useState("");
     const [shouldNavigateToChat, setShouldNavigateToChat] = useState(false);
     const [currentPage, setCurrentPage] = useState(1);
     const [itemsPerPage] = useState(10); // You can make this configurable if needed
     
     // Sort and checkbox states
     const [showSortDropdown, setShowSortDropdown] = useState(false);
     const [sortBy, setSortBy] = useState('name'); // Default sort by name
     const [selectedContacts, setSelectedContacts] = useState([]);
     const [isAllSelected, setIsAllSelected] = useState(false);
     
     // Action loading states
     const [loadingActions, setLoadingActions] = useState({});
     
     // Refs for dropdown
     const sortDropdownRef = useRef(null);
     
     const navigate = useNavigate()

     const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
     const currentSelectedContact = useSelector((state) => state?.selectedContact?.selectedContact);
     const dispatch = useDispatch();

     // Use contacts from props or fallback to empty array
     const allContacts = propAllContacts || { users: [] };

     // Handle outside click for sort dropdown
     useEffect(() => {
          const handleClickOutside = (event) => {
               if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                    setShowSortDropdown(false);
               }
          };

          if (showSortDropdown) {
               document.addEventListener('mousedown', handleClickOutside);
          }

          return () => {
               document.removeEventListener('mousedown', handleClickOutside);
          };
     }, [showSortDropdown]);

     // Effect to handle navigation after contact selection
     useEffect(() => {
          if (shouldNavigateToChat && currentSelectedContact) {
               navigate(`/chat-history`);
               setShouldNavigateToChat(false);
          }
     }, [currentSelectedContact, shouldNavigateToChat, navigate]);

     // Reset to first page when search changes
     useEffect(() => {
          setCurrentPage(1);
     }, [searchContacts]);

     // Handle sort option selection
     const handleSortSelect = (sortOption) => {
          setSortBy(sortOption);
          setShowSortDropdown(false);
     };

     // Handle individual checkbox change
     const handleCheckboxChange = (contactId, isChecked) => {
          if (isChecked) {
               setSelectedContacts(prev => [...prev, contactId]);
          } else {
               setSelectedContacts(prev => prev.filter(id => id !== contactId));
          }
     };

     // Handle master checkbox change
     const handleMasterCheckboxChange = (isChecked) => {
          setIsAllSelected(isChecked);
          if (isChecked) {
               // Select all contacts on current page
               const currentPageContactIds = paginatedContacts.map(contact => contact.id);
               setSelectedContacts(prev => {
                    const newSelected = [...prev];
                    currentPageContactIds.forEach(id => {
                         if (!newSelected.includes(id)) {
                              newSelected.push(id);
                         }
                    });
                    return newSelected;
               });
          } else {
               // Deselect all contacts on current page
               const currentPageContactIds = paginatedContacts.map(contact => contact.id);
               setSelectedContacts(prev => prev.filter(id => !currentPageContactIds.includes(id)));
          }
     };

     // Handle chat icon click with loading state
     const handleChatIconClick = async (contact) => {
          setLoadingActions(prev => ({ ...prev, [`chat-${contact.id}`]: true }));
          try {
               dispatch(changeSelectedContact(contact));
               setShouldNavigateToChat(true);
          } catch (error) {
               console.error('Error navigating to chat:', error);
          } finally {
               setTimeout(() => {
                    setLoadingActions(prev => ({ ...prev, [`chat-${contact.id}`]: false }));
               }, 1000);
          }
     };

     // Handle edit icon click with loading state
     const handleEditClick = async (contactId) => {
          setLoadingActions(prev => ({ ...prev, [`edit-${contactId}`]: true }));
          try {
               navigate(`/contacts/${contactId}`);
          } catch (error) {
               console.error('Error navigating to edit:', error);
          } finally {
               setTimeout(() => {
                    setLoadingActions(prev => ({ ...prev, [`edit-${contactId}`]: false }));
               }, 500);
          }
     };

     // Filter, sort and paginate contacts
     const { paginatedContacts, totalContacts, totalPages } = useMemo(() => {
          if (!allContacts?.users || isLoading) {
               return { paginatedContacts: [], totalContacts: 0, totalPages: 0 };
          }

          // Filter contacts based on search
          let filteredContacts = allContacts.users.filter(contact => {
               if (!searchContacts) return true;
               
               const searchTerm = searchContacts.toLowerCase();
               const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase();
               const phone = contact.phone?.toLowerCase() || '';
               
               return fullName.includes(searchTerm) || phone.includes(searchTerm);
          });

          // Sort contacts
          filteredContacts.sort((a, b) => {
               switch (sortBy) {
                    case 'name':
                         const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                         const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                         return nameA.localeCompare(nameB);
                    case 'role':
                         return (a.role || '').localeCompare(b.role || '');
                    case 'status':
                         return (a.status || '').localeCompare(b.status || '');
                    case 'recent':
                         // Sort by most recent interaction (you might need to adjust this based on your data structure)
                         const dateA = new Date(a.last_contacted || 0);
                         const dateB = new Date(b.last_contacted || 0);
                         return dateB - dateA;
                    default:
                         return 0;
               }
          });

          const total = filteredContacts.length;
          const pages = Math.ceil(total / itemsPerPage);
          
          // Get contacts for current page
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginated = filteredContacts.slice(startIndex, endIndex);

          return {
               paginatedContacts: paginated,
               totalContacts: total,
               totalPages: pages
          };
     }, [allContacts, searchContacts, currentPage, itemsPerPage, sortBy, isLoading]);

     // Update master checkbox state based on current page selections
     useEffect(() => {
          if (isLoading) return;
          const currentPageContactIds = paginatedContacts.map(contact => contact.id);
          const selectedOnCurrentPage = currentPageContactIds.filter(id => selectedContacts.includes(id));
          setIsAllSelected(currentPageContactIds.length > 0 && selectedOnCurrentPage.length === currentPageContactIds.length);
     }, [paginatedContacts, selectedContacts, isLoading]);

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

     const handlePageChange = (page) => {
          setCurrentPage(page);
     };

     // Sort options for dropdown
     const sortOptions = [
          { value: 'name', label: 'Name (A-Z)' },
          { value: 'role', label: 'Role' },
          { value: 'status', label: 'Status' },
          { value: 'recent', label: 'Recent Activity' }
     ];

     // Table skeleton loader
     const TableSkeleton = () => (
          <div className="animate-pulse space-y-4">
               {[...Array(itemsPerPage)].map((_, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4">
                         <div className="w-4 h-4 bg-gray-200 rounded"></div>
                         <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                         <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                         </div>
                         <div className="h-6 bg-gray-200 rounded w-16"></div>
                         <div className="h-4 bg-gray-200 rounded w-20"></div>
                         <div className="h-6 bg-gray-200 rounded w-16"></div>
                         <div className="flex space-x-2">
                              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                         </div>
                    </div>
               ))}
          </div>
     );
     
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
                              disabled={isLoading}
                              className="border-1 border-gray-300 px-8 py-2 outline-green-500 text-sm rounded-xl w-full flex-2/3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                         />
                         <BiSearch className='absolute top-3 left-2' size={15} color={isLoading ? "#d1d5db" : "gray"} />
                         {isLoading && (
                              <div className="absolute top-3 right-2">
                                   <Spinner size="small" />
                              </div>
                         )}
                    </div>

                    {/* Sort By Button */}
                    <div className='flex-1/3 flex w-full space-x-3'>
                         <div ref={sortDropdownRef} className="relative">
                              <button 
                                   onClick={() => !isLoading && setShowSortDropdown(!showSortDropdown)}
                                   disabled={isLoading}
                                   className='flex flex-row items-center justify-center gap-x-1 border-1 border-gray-300 px-3 py-1 rounded-lg font-medium text-gray-700 tracking-wider cursor-pointer focus:border-green-500 shadow-xs hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white'
                              >
                                   <RiSortAsc />
                                   <span>Sort By</span>
                              </button>
                              
                              {/* Sort dropdown */}
                              {showSortDropdown && !isLoading && (
                                   <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]">
                                        {sortOptions.map((option) => (
                                             <button
                                                  key={option.value}
                                                  onClick={() => handleSortSelect(option.value)}
                                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                                                       sortBy === option.value ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                                                  }`}
                                             >
                                                  {option.label}
                                             </button>
                                        ))}
                                   </div>
                              )}
                         </div>
                         
                         <button 
                              disabled={isLoading}
                              className="flex flex-row items-center justify-center gap-x-1 border-1 border-gray-300 px-3 py-1 rounded-lg font-medium text-gray-700 tracking-wider cursor-pointer focus:border-green-500 shadow-xs hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                         >
                              <CiImport />
                              <span>Export</span>
                         </button>

                         {/* This button will handle the "sending template message" */}
                         {/* <button 
                              disabled={isLoading}
                              className="flex flex-row items-center justify-center gap-x-1 border-1 border-gray-300 px-3 py-2 rounded-lg font-medium text-gray-700 tracking-wider cursor-pointer focus:border-green-500 shadow-xs hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                         >
                              <BiDotsVertical />
                         </button> */}
                    </div>

               </div>

               {/* Selected contacts indicator */}
               {selectedContacts.length > 0 && !isLoading && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                         <span className="text-sm text-blue-700">
                              {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
                         </span>
                         <button 
                              onClick={() => {
                                   setSelectedContacts([]);
                                   setIsAllSelected(false);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm underline"
                         >
                              Clear selection
                         </button>
                    </div>
               )}

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
                                                                      <label htmlFor="masterCheckbox"></label>
                                                                      <input 
                                                                           type="checkbox" 
                                                                           id="masterCheckbox" 
                                                                           name="masterCheckbox" 
                                                                           checked={isAllSelected}
                                                                           onChange={(e) => handleMasterCheckboxChange(e.target.checked)}
                                                                           disabled={isLoading}
                                                                           className='accent-green-600 w-4 h-4 cursor-pointer border border-gray-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed' 
                                                                      />
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
                                   {isLoading ? (
                                        <tr>
                                             <td colSpan="6" className="px-6 py-4">
                                                  <TableSkeleton />
                                             </td>
                                        </tr>
                                   ) : isError ? (
                                        <tr>
                                             <td colSpan="6" className="px-6 py-12 text-center">
                                                  <div className="flex flex-col items-center justify-center">
                                                       <div className="text-red-500 mb-4">
                                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                            </svg>
                                                       </div>
                                                       <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading contacts</h3>
                                                       <p className="text-gray-500 text-center">
                                                            There was an error loading the contacts table. Please try refreshing the page.
                                                       </p>
                                                  </div>
                                             </td>
                                        </tr>
                                   ) : paginatedContacts.length > 0 ? (
                                        paginatedContacts.map((contact) => (
                                             <tr key={contact?.id}>

                                                  {/* First Checkbox */}
                                                  <td scope="col" className='px-6 py-4 whitespace-nowrap'>
                                                       <label htmlFor={contact?.id}>
                                                       </label>
                                                       <input 
                                                            type="checkbox" 
                                                            id={contact?.id} 
                                                            checked={selectedContacts.includes(contact?.id)}
                                                            onChange={(e) => handleCheckboxChange(contact?.id, e.target.checked)}
                                                            className='accent-green-600 w-4 h-4 cursor-pointer' 
                                                       />
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
                                                            <button 
                                                                 onClick={() => handleChatIconClick(contact)} 
                                                                 disabled={loadingActions[`chat-${contact.id}`]}
                                                                 className='cursor-pointer p-2 rounded-full hover:text-green-400 text-gray-500 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                                            >
                                                                 {loadingActions[`chat-${contact.id}`] ? (
                                                                      <Spinner size="small" />
                                                                 ) : (
                                                                      <LuMessageSquareMore size={18} />
                                                                 )}
                                                            </button>
                                                            
                                                            {/* Pressed on this Icon and a dialog for editing a contact would open */}
                                                            <button 
                                                                 onClick={() => handleEditClick(contact?.id)} 
                                                                 disabled={loadingActions[`edit-${contact.id}`]}
                                                                 className='cursor-pointer p-2 rounded-full hover:text-green-400 text-gray-500 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                                            >
                                                                 {loadingActions[`edit-${contact.id}`] ? (
                                                                      <Spinner size="small" />
                                                                 ) : (
                                                                      <BiPencil size={18} />
                                                                 )}
                                                            </button>

                                                            {/* <button onClick={() => console.log(contact)} className='cursor-pointer p-2 rounded-full hover:text-green-400 text-gray-500 hover:bg-gray-100 transition-all'>
                                                                 <BsThreeDotsVertical size={18} />
                                                            </button> */}
                                                       </div>
                                                  </td>
                                             </tr>
                                        ))
                                   ) : (
                                        <tr>
                                             <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                  {searchContacts ? 'No contacts found matching your search.' : 'No contacts available.'}
                                             </td>
                                        </tr>
                                   )}
                              </tbody>
                         </table>
                    </div>
                    <div className='flex p-5'>
                         <FooterPagination 
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={handlePageChange}
                              itemsPerPage={itemsPerPage}
                              totalItems={totalContacts}
                              disabled={isLoading}
                         />
                    </div>
               </div>
          </div>
     )
}

export default AllContactsTable