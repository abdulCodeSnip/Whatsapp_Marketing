import React, { useState } from 'react'
import { BiCheck } from 'react-icons/bi'
import { CgClose } from 'react-icons/cg'
import { CiShop } from 'react-icons/ci'
import { FaArrowLeft, FaRegSave } from 'react-icons/fa'
import { GiCheckMark } from 'react-icons/gi'
import { IoMdMic } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { MdOutlineEmojiEmotions } from 'react-icons/md'
import { PiExclamationMark } from 'react-icons/pi'
import { useSelector } from 'react-redux'

const MessagePreviewCard = ({ submitTemplateForApproval, isAllFieldsValid }) => {
     const [showNotification, setShowNotification] = useState(false);
     const [errorMsg, setErrorMsg] = useState("");
     const [successMessage, setSuccessMessage] = useState("");

     // Values from Redux Store
     const messageBody = useSelector((state) => state.messageBody.value);
     const language = useSelector((state) => state.language.value);
     const category = useSelector((state) => state.category.value);
     const templateName = useSelector((state) => state.templateName.value);

     const handleSubmitTemplate = () => {
          if (messageBody?.length <= 0 || language === "" || category === "" || templateName === "") {
               setErrorMsg("Please fill out all the required fields");
          } else if (messageBody?.length <= 9) {
               setErrorMsg("Message Body should be at least 10 characters");
          } else if (templateName?.length <= 5) {
               setErrorMsg("Please Enter a valid Template Name");
          }
          if (isAllFieldsValid) {
               setSuccessMessage("Template Has been submitted for Approval");
          }
     }

     // A REGEX to highlight text

     const variableRegex = /(\{\{\d+\}\})/g;
     const actualMessagePreview = messageBody.split(variableRegex);

     return (
          <>
               {
                    showNotification && (
                         <div className={`fixed top-16 tracking-wide flex flex-row items-center right-20 p-5 gap-x-2 ${errorMsg ? "bg-red-100" : "bg-green-100"} rounded-xl z-50 shadow-sm`}>

                              <div className={`border ${errorMsg ? "text-red-600 border-red-600 hover:bg-red-200" : "hover:bg-green-200 text-green-600 border-green-600"} p-[2px] rounded-full`}>
                                   {
                                        errorMsg ? <PiExclamationMark size={10} /> : <GiCheckMark size={10} />
                                   }
                              </div>

                              <span className={`${errorMsg ? "text-red-600" : "text-green-600"} text-sm`}>
                                   {
                                        errorMsg ? errorMsg : successMessage
                                   }
                              </span>
                              <button onClick={() => setShowNotification(false)} className={`cursor-pointer ${errorMsg ? "text-red-600" : "text-green-600"} p-[2px] rounded-full hover:${errorMsg ? "bg-red-200" : "bg-green-200"}`}>
                                   <CgClose />
                              </button>
                         </div>
                    )
               }
               <div className='sticky top-4'>
                    <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
                         <div className=' px-6 py-4 border-b-1 border-gray-200'>
                              <h2>Message Preview</h2>
                         </div>

                         {/* Phone UI to preview Message Content */}
                         <div className='w-[300px] mx-auto h-[540px] my-4 border-10 border-gray-900 rounded-3xl flex flex-col justify-between flex-1 bg-gray-200'>

                              {/* Header of the Phone UI */}
                              <div className='bg-teal-500 p-3 rounded-t-xl rounded-b-none flex items-center gap-x-2'>
                                   <FaArrowLeft size={13} color="white" />
                                   <div className='bg-gray-50 rounded-full p-1'>
                                        <CiShop size={20} color="gray" />
                                   </div>
                                   <div className='text-gray-200 font-medium text-sm flex flex-col'>
                                        <span>Elia Martel</span>
                                        <span className='text-gray-200 font-normal text-xs'>Online</span>
                                   </div>
                              </div>

                              {/* Content of the Phone UI */}
                              <div className='overflow-y-auto'>
                                   <div className='my-3 mx-2 space-y-3'>
                                        {/* Message Overview from Admin and templates */}
                                        <div className='w-[165px] rounded-lg p-3 bg-white rounded-tl-none shadow'>
                                             <div className='text-sm text-gray-800'>
                                                  <p>Hello! How can I help you today.</p>
                                             </div>
                                             <div>
                                                  <p className='text-gray-600 text-xs text-right'>10:35 AM</p>
                                             </div>
                                        </div>

                                        {/* Message Overview from User */}
                                        <div className="flex items-end justify-end">
                                             <div className='w-[165px] rounded-xl shadow rounded-tr-none p-3 bg-[#DCF8C6]'>
                                                  <div className='text-sm text-gray-800'>
                                                       <p>I'd like to know more about your services.</p>
                                                  </div>
                                                  <div>
                                                       <p className='text-gray-600 text-xs text-right'>10:36 AM</p>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Template Message Overview */}
                                        <div className='w-[165px] rounded-lg p-3 bg-white rounded-tl-none shadow'>
                                             <div>
                                                  <p>
                                                       {
                                                            actualMessagePreview?.map((message, index) => {
                                                                 if (variableRegex.test(message)) {
                                                                      return (
                                                                           <span key={index} className='bg-blue-100 rounded-lg mx-1 text-blue-700 text-sm'>
                                                                                {
                                                                                     message
                                                                                }
                                                                           </span>
                                                                      )
                                                                 } else {
                                                                      return (
                                                                           <span key={index} className='text-sm text-gray-800'>{message}</span>
                                                                      )
                                                                 }
                                                            })
                                                       }
                                                  </p>
                                             </div>
                                             <div>
                                                  <p className='text-gray-600 text-xs text-right'>10:38 AM</p>
                                             </div>
                                        </div>

                                   </div>

                              </div>

                              {/* Footer of the image from USER */}
                              <div className='flex flex-row items-center justify-between p-3 bg-gray-100 rounded-b-xl gap-x-2'>
                                   <MdOutlineEmojiEmotions size={20} color="gray" />
                                   <div className='p-2 rounded-full flex w-full items-start justify-start bg-white'>
                                        <span className='text-gray-400 text-xs'>Type a message</span>
                                   </div>
                                   <IoMdMic size={20} color="gray" />
                              </div>

                         </div>
                    </div>

                    {/* Custom Buttons to Handle Templates */}
                    <div className='my-5 space-y-4'>

                         {/* Submit Button to Submit Template and store it permantly */}
                         <button
                              disabled={!isAllFieldsValid}
                              className='flex disabled:opacity-80 disabled:cursor-not-allowed flex-row items-center justify-center gap-x-2 p-3 bg-green-500 text-white rounded-lg w-full hover:opacity-90 transition-all cursor-pointer'
                              onClick={() => {
                                   handleSubmitTemplate();
                                   setShowNotification(true);
                                   submitTemplateForApproval();
                                   setTimeout(() => {
                                        setShowNotification(false);
                                   }, 4000);
                              }}>
                              <BiCheck size={20} color="white" />
                              <span className=''>Submit for Approval</span>
                         </button>

                         <button className='flex flex-row items-center justify-center gap-x-2 p-3 bg-white text-gray-800 rounded-lg w-full shadow-sm border-1 border-gray-400 hover:bg-gray-100 transition-all cursor-pointer'>
                              <FaRegSave size={20} color='gray' />
                              <span >Save As Draft!</span>
                         </button>

                         <button className='flex flex-row items-center justify-center gap-x-2 p-3 bg-white text-gray-800 rounded-lg w-full shadow-sm border-1 border-gray-400 hover:bg-gray-100 transition-all cursor-pointer'>
                              <IoClose size={20} color='gray' />
                              <span>Cancel</span>
                         </button>
                    </div>
               </div>
          </>
     )
}

export default MessagePreviewCard
