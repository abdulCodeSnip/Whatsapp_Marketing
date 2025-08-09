import React, { use, useState } from 'react'
import { CgClose } from 'react-icons/cg'
import { useDispatch, useSelector } from 'react-redux';
import { addNewContactToDB } from '../../redux/contactsPage/addContacts';
import { changingErrorMessageOnSuccess } from '../../redux/contactsPage/errorMessage';

const AddContactsDialog = ({ closeDialog, title, saveContact }) => {

     const dispatch = useDispatch();

     const [userContactData, setUserContactData] = useState({
          first_name: "",
          last_name: "",
          countryCode: "",
          phone: "",
          email: "",
          role: "user",
     });
     const registerNewUser = async () => {
          try {
               const apiResponse = await fetch(`http://whatsapp-app-api.servicsters.com/auth/register`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                         first_name: userContactData.first_name,
                         last_name: userContactData?.last_name,
                         email: userContactData?.email,
                         phone: userContactData.phone,
                         password: userContactData?.password || "passowrd",
                         role: userContactData?.role || "user",
                    })
               });

               const result = await apiResponse.json();
               console.log(result?.message);
               if (apiResponse.ok) {
                    const message = { content: "Contact added successfully!", type: "Success" }
                    dispatch(changingErrorMessageOnSuccess(message))
               } else if (apiResponse.status === 400) {
                    const message = { content: "Contact already exists", type: "Error" };
                    dispatch(changingErrorMessageOnSuccess(message));
               }

          } catch (error) {
               console.log("Error: ", error.message);
          }
     }


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
                    {/* First Name of Contact */}
                    <div>
                         {/* Input for Contact Name */}
                         <label htmlFor="first_name" className='block tracking-wide font-medium text-sm text-gray-800'>
                              First Name
                              <span className='text-red-600 font-medium ml-1 text-base'>*</span>
                         </label>
                         <input type="text" name="first_name" value={userContactData.first_name} onChange={(e) => setUserContactData({ ...userContactData, first_name: e.target.value })} id="first_name" placeholder='Enter contact name' className='border border-gray-300 rounded-xl w-full px-3 py-2 outline-green-500 mb-2 mt-1' />
                    </div>

                    {/* Last Name of contactt  */}
                    <div>
                         <label htmlFor="last_name" className='block tracking-wide font-medium text-sm text-gray-800'>
                              Last Name
                              <span className='text-red-600 font-medium ml-1 text-base'>*</span>
                         </label>
                         <input type="text" value={userContactData.last_name} onChange={(e) => setUserContactData({ ...userContactData, last_name: e.target.value })} id="last_name" name='last_name' placeholder='Enter contact name' className='border border-gray-300 rounded-xl w-full px-3 py-2 outline-green-500 mb-2 mt-1' />
                    </div>

                    {/* Phone Number with Country Code */}
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
                                   required
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
                                   value={userContactData.phone}
                                   onChange={(e) =>
                                        setUserContactData({ ...userContactData, phone: e.target.value })}
                                   placeholder='Phone number'
                                   className='border border-gray-300 outline-green-500 rounded-r-xl w-full px-3 py-2' />
                         </div>
                         <div className='text-gray-500 text-xs tracking-wide my-1'>
                              <span>Include country code (e.g., +1 for U.S)</span>
                         </div>
                    </div>

                    {/* User Email */}
                    <div className='my-3'>
                         <label htmlFor='contactEmail' className='text-gray-800 text-sm font-medium block tracking-wide'>
                              Email (Optional)
                         </label>
                         <input
                              type="email"
                              id='contactEmail'
                              value={userContactData.email}
                              onChange={(e) => setUserContactData({ ...userContactData, email: e.target.value })}
                              name='contactEmail'
                              placeholder='Enter email address'
                              className='border border-gray-300 outline-green-500 rounded-xl w-full px-3 py-2 my-1' />
                    </div>

                    {/* User Tags such as Customer, marketing and anything else */}
                    <div>
                         <h2 className='text-sm font-medium text-gray-600 block'>Tags</h2>
                         <div className='flex flex-row items-center gap-x-2'>
                              <div className='bg-blue-100 font-medium text-xs text-blue-600 px-3 py-1 rounded-full w-[90px] flex items-center justify-between my-2 flex-row '>
                                   <h2>Customer</h2>
                                   <button className='cursor-pointer'><CgClose size={13} /></button>
                              </div>
                         </div>
                    </div>

                    {/* Button to submit Contact */}
                    <div className='flex flex-row items-end justify-end'>
                         <button
                              disabled={userContactData.name === "" || userContactData.phone === ""}
                              onClick={() => {
                                   saveContact();
                                   dispatch(addNewContactToDB(userContactData));
                                   closeDialog();
                                   registerNewUser();
                              }}
                              className='bg-green-500 text-white cursor-pointer disabled:cursor-auto font-medium text-sm tracking-wide px-3 py-2 rounded-lg shadow-md disabled:opacity-85'>
                              <span>Save Contact</span>
                         </button>
                    </div>
               </div>
          </div >
     )
}

export default AddContactsDialog
