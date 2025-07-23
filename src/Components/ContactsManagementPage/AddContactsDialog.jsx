import React, { useState } from 'react'
import { CgClose } from 'react-icons/cg'
import { useDispatch, useSelector } from 'react-redux';
import { addContact } from '../../redux/contactsPage/addContacts';

const AddContactsDialog = ({ closeDialog, title, saveContact }) => {

     const [apiResult, setApiResult] = useState(null);
     const dispatch = useDispatch();

     const [userContactData, setUserContactData] = useState({
          contactName: "",
          contactPhone: "",
          countryCode: "",
          contactEmail: "",
          contactTag: "",
          contactAdditionalNotes: "",
          contactGroup: "",
     });

     const contacts = useSelector((state) => state?.contacts);

     return (
          <div className='space-y-2 divide-y divide-gray-300'>
               <div className='flex flex-row justify-between w-full p-3 mt-2'>
                    <h2 className='text-lg font-medium text-gray-800'>{title}</h2>
                    <div>
                         <button onClick={closeDialog} className='cursor-pointer text-gray-500 '>
                              <CgClose size={18} />
                         </button>
                    </div>
               </div>

               <div className='px-5 py-2 space-y-2'>
                    <div>
                         {/* Input for Contact Name */}
                         <label htmlFor="contactName" className='block tracking-wide font-medium text-sm text-gray-800'>
                              Full Name
                              <span className='text-red-600 font-medium ml-1 text-base'>*</span>
                         </label>
                         <input type="text" value={userContactData.contactName} onChange={(e) => setUserContactData({ ...userContactData, contactName: e.target.value })} id="contactName" placeholder='Enter contact name' className='border border-gray-300 rounded-xl w-full px-3 py-2 outline-green-500 mb-2 mt-1' />
                    </div>

                    <div className='mt-2'>
                         {/* Input for contact Phone Number */}
                         <label
                              htmlFor="contactPhone"
                              className='font-medium text-sm tracking-wide text-gray-800 block my-2'>
                              Phone Number
                              <span className='text-red-600 font-medium text-base ml-1'>*</span>
                         </label>
                         <div className='flex flex-row '>
                              <select id="countryCode"
                                   name="countryCode"
                                   value={userContactData.countryCode}
                                   onChange={(e) => setUserContactData({ ...userContactData, countryCode: e.target.value })}
                                   className='border border-gray-300 rounded-l-xl px-3 py-2 cursor-pointer text-sm font-medium text-gray-800 outline-green-500'>
                                   <option value="">Code</option>
                                   <option value="+1">+1</option>
                                   <option value="+44">+44</option>
                                   <option value="+91">+91</option>
                                   <option value="+92">+92</option>
                                   <option value="+61">+61</option>
                                   <option value="+34">+34</option>
                              </select>
                              <input
                                   type="tel"
                                   id="contactPhone"
                                   value={userContactData.contactPhone}
                                   onChange={(e) =>
                                        setUserContactData({ ...userContactData, contactPhone: e.target.value })}
                                   placeholder='Phone number'
                                   className='border border-gray-300 outline-green-500 rounded-r-xl w-full px-3 py-2' />
                         </div>
                         <div className='text-gray-500 text-xs tracking-wide my-1'>
                              <span>Include country code (e.g., +1 for U.S)</span>
                         </div>
                    </div>

                    <div className='my-3'>
                         <label htmlFor='contactEmail' className='text-gray-800 text-sm font-medium block tracking-wide'>
                              Email (Optional)
                         </label>
                         <input
                              type="email"
                              id='contactEmail'
                              value={userContactData.contactEmail}
                              onChange={(e) => setUserContactData({ ...userContactData, contactEmail: e.target.value })}
                              name='contactEmail'
                              placeholder='Enter email address'
                              className='border border-gray-300 outline-green-500 rounded-xl w-full px-3 py-2 my-1' />
                    </div>

                    <div>
                         <h2 className='text-sm font-medium text-gray-600 block'>Tags</h2>
                         <div className='flex flex-row items-center gap-x-2'>
                              <div className='bg-blue-100 font-medium text-xs text-blue-600 px-3 py-1 rounded-full w-[90px] flex items-center justify-between my-2 flex-row '>
                                   <h2>Customer</h2>
                                   <button className='cursor-pointer'><CgClose size={13} /></button>
                              </div>
                              <div>
                                   <button className='bg-gray-50 p-1 rounded-full border-[0.5px] border-gray-400 text-gray-600 font-medium text-[10px] cursor-pointer'>+Add Tag</button>
                              </div>
                         </div>
                    </div>

                    <div>
                         <label htmlFor="addToGroup" className='text-sm font-medium text-gray-600 block'>Add to Group (Optional)</label>
                         <select name="addToGroup" id="addToGroup" value={userContactData.contactGroup} onChange={(e) => setUserContactData({ ...userContactData, contactGroup: e.target.value })} className='text-sm cursor-pointer text-gray-700 font-medium rounded-xl border my-1 border-gray-200 p-2'>
                              <option className='p-2 text-sm font-medium text-gray-600 cursor-pointer' value="">Select a Group (optional)</option>
                              <option className='p-2 text-sm font-medium text-gray-600 cursor-pointer' value="customers">Customers</option>
                              <option className='p-2 text-sm font-medium text-gray-600 cursor-pointer' value="prospect">Prospect</option>
                              <option className='p-2 text-sm font-medium text-gray-600 cursor-pointer' value="supporTeam">Support Team</option>
                              <option className='p-2 text-sm font-medium text-gray-600 cursor-pointer' value="markingList">Marketing List</option>
                         </select>
                    </div>

                    <div>
                         <label htmlFor="additionalNotes" className='text-sm font-medium text-gray-800 block tracking-wide'>Notes (Optional)</label>
                         <textarea name="additionalNotes" value={userContactData.contactAdditionalNotes} onChange={(e) => setUserContactData({ ...userContactData, contactAdditionalNotes: e.target.value })} id="additionalNotes" placeholder='Add any notes about this contact' className='border-1 border-dashed border-gray-300 w-full rounded-xl px-3 py-2 text-sm mt-2' />
                    </div>

                    <div className='flex flex-row items-end justify-end'>
                         <button
                              disabled={userContactData.contactName === "" || userContactData.contactPhone === ""}
                              onClick={() => {
                                   saveContact();
                                   dispatch(addContact({
                                        firstname: userContactData.contactName?.split(" ").at(0),
                                        lastname: userContactData.contactName.split(" ").at(1),
                                        email: userContactData.contactEmail,
                                        phone: userContactData.countryCode + userContactData.contactPhone,
                                        group: userContactData.contactGroup,
                                        role: "user",
                                        notes: userContactData.contactAdditionalNotes
                                   }));
                                   console.log(contacts?.contacts);
                              }}
                              className='bg-green-500 text-white cursor-pointer disabled:cursor-auto font-medium text-sm tracking-wide px-3 py-2 rounded-lg shadow-md disabled:opacity-85'>
                              <span>Save Contact</span>
                         </button>
                    </div>
               </div>
          </div>
     )
}

export default AddContactsDialog
