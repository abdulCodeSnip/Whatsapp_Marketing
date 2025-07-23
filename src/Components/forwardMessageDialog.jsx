import React, { useState } from 'react'
import { CgClose } from 'react-icons/cg'
import CustomInput from './customInput'

const ForwardMessageDialog = ({ title, closeForwardDialog }) => {
     const [searchContacts, setSearchContacts] = useState("");
     const [selectedContacts, setSelectedContact] = useState([]);

     // Default Recent Contacts, which we can modify, if real time data is fetched and done

     const [recentContacts, setRecentContacts] = useState(
          [
               {
                    id: 1, contactName: "Emily Morgan", contactPhone: "+91 321 2355123"
               },
               {
                    id: 2, contactName: "John Doe", contactPhone: "+1 7212 355123"
               },
               {
                    id: 3, contactName: "Abdul Qadeer", contactPhone: "+92 321 10411212"
               }
          ]
     );

     // Get the selected array value and insert it into a new array

     const handleSelectedContacts = (contact) => {
          if (!selectedContacts.some(selected => selected.id === contact.id)) {
               setSelectedContact([...selectedContacts, contact]);
          }
     }

     console.log(selectedContacts);

     const handleForwardSelection = (id) => {
          setSelectedContact(prev =>
               prev.filter(contact => contact.id !== id)
          );
     };

     return (
          <div className='flex flex-col divide-y divide-gray-100 gap-y-2'>
               <div className='flex flex-row items-center justify-between w-full gap-x-2 '>
                    <div>
                         <h2 className='font-semibold text-lg text-gray-800'>{title}</h2>
                    </div>
                    <div className='cursor-pointer p-2 rounded-full hover:bg-gray-100' onClick={closeForwardDialog}>
                         <CgClose size={20} />
                    </div>
               </div>

               {/* An Input to search for recent contact in contacts list */}
               <div>
                    <CustomInput
                         placeholder={"Search contacts...."}
                         name={"searchContacts"}
                         value={searchContacts}
                         handleOnChange={(e) => setSearchContacts(e.target.value)} />

                    {/* If the user selected some contact, then these contact would be shown here */}
                    {
                         selectedContacts.length > 0 &&
                         <div className="flex flex-row my-2 px-4 gap-x-2">
                              {
                                   selectedContacts.map((selected) => (
                                        <div key={selected?.id} className='p-1 bg-green-100 text-sm text-green-500 rounded-full px-3 cursor-pointer flex flex-row items-center justify-center'>
                                             <span>{selected?.contactName}</span>
                                             <div onClick={() => handleForwardSelection(selected?.id)}>
                                                  <CgClose size={16} />
                                             </div>
                                        </div>
                                   ))
                              }
                         </div>
                    }
                    <div className='my-3 flex flex-col'>
                         <div>
                              <h2 className='text-gray-600 font-medium text-sm my-2'>Recent Contacts</h2>
                         </div>

                         {/* A logo for all Recent Contacts, also for adding to forward message*/}
                         <div className='flex flex-col space-y-2'>
                              {
                                   recentContacts.map((contact) => (
                                        <div
                                             onClick={() => handleSelectedContacts(contact)}
                                             className='flex flex-row p-3 hover:bg-gray-50 cursor-pointer rounded-lg '>
                                             {/* Logo for each contact */}
                                             <h2
                                                  className={`font-medium w-[40px] h-[40px] rounded-full p-2 ${contact.id === 1 ? "bg-amber-200 text-amber-700" : contact.id === 2 ? "bg-green-200 text-green-700" : "bg-purple-100 text-purple-700"} my-1"}`}>
                                                  {
                                                       contact.contactName.split(" ").at(0).charAt(0).toUpperCase() + contact.contactName.split(" ").at(1).charAt(0).toUpperCase()
                                                  }
                                             </h2>
                                             <div>
                                                  <span className={`p-2 block"`}>{contact.contactName}</span>
                                                  <span className='block text-xs text-gray-500'>{contact.contactPhone
                                                  }</span>
                                             </div>
                                        </div>
                                   ))
                              }
                              <div className='w-full p-4'>
                                   <div>
                                        <h2 className='text-gray-700 text-sm mb-2'>Add a not (optional)</h2>
                                        <textarea
                                             name="forwardMessageNote"
                                             className={`w-full border-2 h-20 text-gray-700 p-1 border-gray-200 outline-none rounded-2xl focus:border-green-500`}
                                             id="forwardMessageNote" />
                                   </div>
                                   <div className='flex flex-row items-center justify-end gap-x-2 my-3'>
                                        <button
                                             className='bg-gray-100 text-gray-500 text-sm px-4 py-2 border-[2px] focus:border-gray-200 border-gray-300 font-medium rounded-lg cursor-pointer hover:bg-gray-50 transition-all'
                                             onClick={closeForwardDialog}
                                        >
                                             Cancel
                                        </button>

                                        <button
                                             className='bg-green-500 text-white text-sm px-4 py-2 border-green-400 border-[2px] rounded-lg cursor-pointer font-medium hover:opacity-90 disabled:bg-green-300 disabled:border-gray-200'
                                             disabled={selectedContacts.length <= 0}
                                        >Forward</button>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default ForwardMessageDialog
