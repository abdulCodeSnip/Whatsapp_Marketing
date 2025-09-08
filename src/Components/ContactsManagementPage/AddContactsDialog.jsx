import React, { use, useState } from 'react'
import { CgClose } from 'react-icons/cg'
import { useDispatch, useSelector } from 'react-redux';
import { addNewContactToDB } from '../../redux/contactsPage/addContacts';
import { changingErrorMessageOnSuccess } from '../../redux/contactsPage/errorMessage';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './PhoneInput.css';
import Spinner from '../Spinner';

const AddContactsDialog = ({ closeDialog, title, saveContact, onLoadingChange }) => {

     const dispatch = useDispatch();

     const [userContactData, setUserContactData] = useState({
          first_name: "",
          last_name: "",
          countryCode: "",
          phone: "",
          email: "",
          role: "user",
     });
     const [isLoading, setIsLoading] = useState(false);
     // register new user or create new contacts
     const registerNewUser = async () => {
          setIsLoading(true);
          // Notify parent about loading state
          if (onLoadingChange) {
               onLoadingChange(true);
          }
          try {
               const apiResponse = await fetch(`${import.meta.env?.VITE_API_URL}/auth/register`, {
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
               if (apiResponse.ok) {
                    const message = { content: "Contact added successfully!", type: "Success" }
                    dispatch(changingErrorMessageOnSuccess(message));
                    
                    // Call the parent callback to refresh contacts
                    if (saveContact) {
                         saveContact();
                    }
                    
                    // Close modal only on success
                    closeDialog();
               } else if (apiResponse.status === 400) {
                    const message = { content: "User with email or phone number already exists", type: "Error" };
                    dispatch(changingErrorMessageOnSuccess(message));
               } else {
                    const message = { content: result.message || "Failed to add contact", type: "Error" };
                    dispatch(changingErrorMessageOnSuccess(message));
               }

          } catch (error) {
               console.log("Error: ", error.message);
               const message = { content: "Network error occurred. Please try again.", type: "Error" };
               dispatch(changingErrorMessageOnSuccess(message));
          } finally {
               setIsLoading(false);
               // Notify parent about loading state
               if (onLoadingChange) {
                    onLoadingChange(false);
               }
          }
     }


     return (
          <div className='space-y-2 divide-y divide-gray-300'>
               <div className='flex flex-row justify-between w-full p-3 mt-2'>
                    <h2 className='text-lg font-medium text-gray-800'>{title}</h2>
                    <div>
                         <button 
                              onClick={isLoading ? undefined : closeDialog} 
                              disabled={isLoading}
                              className={`text-gray-500 ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-gray-700'} transition-colors`}
                              title={isLoading ? "Please wait..." : "Close"}
                         >
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
                         <input 
                              type="text" 
                              name="first_name" 
                              value={userContactData.first_name} 
                              onChange={(e) => setUserContactData({ ...userContactData, first_name: e.target.value })} 
                              id="first_name" 
                              placeholder='Enter first name' 
                              disabled={isLoading}
                              className='border border-gray-300 rounded-xl w-full px-3 py-2 outline-green-500 mb-2 mt-1 disabled:bg-gray-100 disabled:cursor-not-allowed' 
                         />
                    </div>

                    {/* Last Name of contactt  */}
                    <div>
                         <label htmlFor="last_name" className='block tracking-wide font-medium text-sm text-gray-800'>
                              Last Name
                              <span className='text-red-600 font-medium ml-1 text-base'>*</span>
                         </label>
                         <input 
                              type="text" 
                              value={userContactData.last_name} 
                              onChange={(e) => setUserContactData({ ...userContactData, last_name: e.target.value })} 
                              id="last_name" 
                              name='last_name' 
                              placeholder='Enter last name' 
                              disabled={isLoading}
                              className='border border-gray-300 rounded-xl w-full px-3 py-2 outline-green-500 mb-2 mt-1 disabled:bg-gray-100 disabled:cursor-not-allowed' 
                         />
                    </div>

                    {/* Phone Number with Country Code Picker */}
                    <div className='mt-2'>
                         <label
                              htmlFor="contactPhone"
                              className='font-medium text-sm tracking-wide text-gray-800 block my-2'>
                              Phone Number
                              <span className='text-red-600 font-medium text-base ml-1'>*</span>
                         </label>
                         <div className='phone-input-container'>
                              <PhoneInput
                                   international
                                   countryCallingCodeEditable={false}
                                   defaultCountry="US"
                                   value={userContactData.phone}
                                   onChange={(phone) => setUserContactData({ ...userContactData, phone: phone || "" })}
                                   className='phone-input-custom'
                                   disabled={isLoading}
                                   placeholder="Enter phone number"
                              />
                         </div>
                         <div className='text-gray-500 text-xs tracking-wide my-1'>
                              <span>Select country and enter your phone number</span>
                         </div>
                    </div>

                    {/* User Email */}
                    <div className='my-3'>
                         <label htmlFor='contactEmail' className='text-gray-800 text-sm font-medium block tracking-wide'>
                              Email 
                         </label>
                         <input
                              type="email"
                              id='contactEmail'
                              value={userContactData.email}
                              onChange={(e) => setUserContactData({ ...userContactData, email: e.target.value })}
                              name='contactEmail'
                              placeholder='Enter email address'
                              disabled={isLoading}
                              className='border border-gray-300 outline-green-500 rounded-xl w-full px-3 py-2 my-1 disabled:bg-gray-100 disabled:cursor-not-allowed' />
                    </div>

                    {/* Button to submit Contact, and store in database */}
                    <div className='flex flex-row items-end justify-end'>
                         <button
                              disabled={!userContactData.first_name || !userContactData.last_name || !userContactData.phone || isLoading}
                              onClick={() => {
                                   dispatch(addNewContactToDB(userContactData));
                                   registerNewUser(); // This will handle closing the modal after API completes
                              }}
                              className='bg-green-500 disabled:cursor-not-allowed text-white cursor-pointer font-medium text-sm tracking-wide px-4 py-2 rounded-lg shadow-md disabled:opacity-50 hover:bg-green-600 transition-colors flex items-center gap-2'>
                              {isLoading && <Spinner size="small" />}
                              <span>{isLoading ? 'Adding Contact...' : 'Save Contact'}</span>
                         </button>
                    </div>
               </div>
          </div >
     )
}

export default AddContactsDialog
