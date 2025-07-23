import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { CgClose } from 'react-icons/cg'
import { IoMdSearch } from 'react-icons/io'
import { useSelector } from 'react-redux'

const CreateGroupDialog = ({ submitGroup, closeDialog }) => {

     const [isSearchInputActive, setIsSearchInputActive] = useState(false);
     const [searchContacts, setSearchContacts] = useState("");
     const [selectedContacts, setSelectedContacts] = useState([]);
     const contacts = useSelector((state) => state?.allContacts?.allContacts?.at(0));

     const [defaultContacts, setDefaultContacts] = useState(
          [
               {
                    contactId: "1",
                    contactName: "Emila Watson",
                    contactPhone: "+92 312122343",
               },
               {
                    contactId: "2",
                    contactName: "Jonny Depth",
                    contactPhone: "+44 555123 123",
               },
               {
                    contactId: "3",
                    contactName: "Mr. Abdussalam",
                    contactPhone: "+9323 22351533",
               },
               {
                    contactId: "4",
                    contactName: "Zalmi Khan",
                    contactPhone: "+1 9123123882347"
               }
          ]
     );

     // Get the Selcted Contacts for creating group

     const getSelectedContacts = (contact) => {

          console.log(contacts?.find((mycontact) => (mycontact?.first_name === contact?.first_name || mycontact?.last_name === contact?.last_name)));
          setSelectedContacts(prev => {
               if (prev.find(mycontact => mycontact.phone === contact.phone)) {
                    return prev.filter(c => c.phone !== contact.phone);
               } else {
                    return [...prev, contact];
               }
          })
     }



     return (
          <div className='flex flex-col divide-y divide-gray-300 space-y-3'>
               <div className='px-5 py-4 flex flex-row justify-between items-center'>
                    <div>
                         <h2 className='text-lg font-medium text-gray-800'>Create Contact Group</h2>
                    </div>
                    <button
                         onClick={closeDialog}
                         className='p-2 rounded-full hover:bg-gray-50 transition-all cursor-pointer'>
                         <CgClose size={13} />
                    </button>
               </div>

               <div className='px-4 py-2 space-y-2'>
                    <div>
                         <label htmlFor="groupName" className='text-sm ml-1 py-1 font-medium text-gray-600 block'>
                              Group Name
                              <span className='text-red-600'>*</span>
                         </label>
                         <input type="text" placeholder='Enter group name' id='groupName' name='groupName' className='px-3 py-2 border border-gray-200 w-full text-sm rounded-xl outline-green-500' />
                    </div>
                    <div>
                         <label htmlFor="groupDescription" className='text-sm font-medium text-gray-600 block ml-1 py-1'>
                              Group Description (Optional)
                         </label>
                         <textarea name="groupDescription" id="groupDescription" rows={4} placeholder='Enter group description' className='w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-green-500' />
                    </div>

                    <div onFocus={() => setIsSearchInputActive(true)} onBlur={() => setIsSearchInputActive(false)}>
                         <label htmlFor="addContactToGroup" className='text-sm font-medium text-gray-600 block ml-1 py-1'>
                              Add Contacts to Group
                         </label>
                         <div className={`${isSearchInputActive ? "border-green-500 border-[2px]" : "border-gray-200 border-[2px]"} relative px-3 py-2 rounded-xl`} id='addContactsToGroup'>
                              <div className='ml-4'>
                                   <input
                                        type="text"
                                        value={searchContacts}
                                        onChange={(e) => setSearchContacts(e.target.value)}
                                        placeholder='Search contacts to add...'
                                        onFocus={() => setIsSearchInputActive(true)}
                                        className='outline-none text-sm w-full'
                                        id='addContactToGroup'
                                   />
                              </div>
                              <div className='absolute top-[11px] left-[5px]'>
                                   <IoMdSearch size={18} color='gray' className='outline-none' />
                              </div>
                         </div>
                    </div>

                    {/* A div for default contacts */}
                    <div className='rounded-xl border-gray-200 border overflow-y-auto overflow-x-hidden divide-y divide-gray-300 h-[150px] space-y-2'>
                         {
                              contacts.filter((contacts) => (
                                   contacts?.first_name?.toLowerCase()?.includes(searchContacts?.trim()?.toLowerCase()) || contacts?.last_name.toLowerCase()?.includes(searchContacts?.trim()?.toLowerCase())
                              )).map((dcontact, index) => {
                                   const isChecked = selectedContacts.some((scontact) => (scontact?.first_name === dcontact?.first_name) && (scontact?.phone === dcontact?.phone));
                                   console.log(isChecked);
                                   return (
                                        <div key={index} id="searchContactByName" onClick={() => getSelectedContacts(dcontact)} className='flex p-2 flex-row gap-x-2 cursor-pointer'>
                                             <div className="flex items-center justify-center">
                                                  <label htmlFor="searchContactByName" className='p-2'></label>

                                                  <input type="checkbox" onChange={() => getSelectedContacts(dcontact)} checked={isChecked} className='accent-green-600 cursor-pointer w-4 h-4'
                                                       name="searchContactByName" id="searchContactByName" />
                                             </div>
                                             <div className='text-gray-500 text-sm flex flex-col items-center justify-start'>
                                                  <span className='text-gray-700 text-left font-medium cursor-pointer'>{dcontact.first_name + " " + dcontact?.last_name}</span>
                                                  <span className='text-xs'>{dcontact?.phone}</span>
                                             </div>
                                        </div>
                                   )
                              })
                         }
                    </div>

                    <div>
                         <div>
                              <span className='text-xs text-gray-500'>
                                   Selected {selectedContacts.length} Contacts :
                              </span>
                         </div>
                    </div>

                    <div className="flex flex-row justify-end items-center gap-x-2">
                         <button
                              onClick={closeDialog}
                              className='text-gray-500 font-semibold text-sm px-3 py-2  bg-white  hover:text-gray-600 transition-all cursor-pointer border hover:bg-gray-50  border-gray-300 rounded-lg shadow'>
                              <span>Cancel</span>
                         </button>
                         <button
                              onClick={submitGroup}
                              className='text-white text-sm font-medium border rounded-lg cursor-pointer transition-all hover:opacity-90 bg-green-500 px-3 py-2 shadow disabled:opacity-70 disabled:cursor-auto' disabled={selectedContacts.length <= 1}>
                              <span>
                                   Create Group
                              </span>
                         </button>
                    </div>
               </div>
          </div>
     )
}

export default CreateGroupDialog
