import React, { useRef, useState } from 'react'
import PickFileDynamically from '../pickDynamicFile';
import { RiBold, RiItalic, RiUnderline, RiUpload2Line } from 'react-icons/ri';
import { MdOutlineEmojiEmotions, MdOutlineFormatListBulleted, MdOutlineFormatListNumbered } from 'react-icons/md';
import CustomTextArea from '../customTextArea';
import { AiOutlinePlaySquare } from 'react-icons/ai';
import { IoImage } from 'react-icons/io5';
import { LuCode } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { onChangeVariables } from '../../redux/templatePage/variables';
import { onChangeMessageBody } from '../../redux/templatePage/messageSlice';
import EmojiPicker from 'emoji-picker-react';


const MessageInformationCard = () => {

     const [fileType, setFileType] = useState(null);
     const [fileURL, setFileURL] = useState("");
     const [showEmojis, setShowEmojis] = useState(false);


     // Redux States
     const messageBody = useSelector((state) => state?.messageBody?.value);
     const dispatch = useDispatch();

     const pickImageReference = useRef(null);
     const pickVideoReference = useRef(null);
     const pickDocumentReference = useRef(null);

     const handlePickImage = () => {
          pickImageReference.current.click();
     }

     const handlePickVideo = () => {
          pickVideoReference.current.click();
     }

     const handlePickDocument = () => {
          pickDocumentReference.current.click();
     }

     // File type for providing the view for a file
     const handleFileType = (e) => {
          const file = e.target.files[0];
          if (file) {
               const fileURL = URL.createObjectURL(file);
               setFileURL(fileURL);
               setFileType(file.type);
          }
     }

     const insertVariableValue = () => {
          const promptVaue = prompt("Enter a variable value", 1);
          if (promptVaue) {
               const variable = `${promptVaue}`;
               const updateInputWithVariables = messageBody + `{{${promptVaue}}}`
               dispatch(onChangeVariables(variable));
               dispatch(onChangeMessageBody(updateInputWithVariables))
          }
     }
     return (
          <div className='bg-white rounded-xl shadow-sm divide-y divide-gray-200 flex flex-col w-full space-y-4'>
               <div className='px-4 py-3'>
                    <h2 className='text-lg font-medium text-gray-800'>Message Content</h2>
               </div>
               <div className='m-4'>
                    <label htmlFor="messageBody" className='mb-1 p-2 text-sm font-medium text-gray-700 block'>
                         Message Body
                         <span className='text-red-600'>*</span>
                    </label>
                    <div className='rounded-xl border-gray-300 border divide-y divide-gray-300'>
                         <div className='p-3 bg-gray-50 rounded-tl-xl rounded-tr-xl flex flex-row items-center justify-start gap-x-3 divide-x-1 divide-gray-300'>
                              <div className='flex gap-x-3 pr-2'>

                                   {/* Bold Text Button */}
                                   <button className='p-2 rounded-md hover:bg-gray-200 cursor-pointer transition-all'>
                                        <RiBold size={17} />
                                   </button>

                                   {/* Italic Text Button */}
                                   <button className='p-2 rounded-md hover:bg-gray-200 cursor-pointer transition-all'>
                                        <RiItalic size={17} />
                                   </button>

                                   {/* Underline text button */}
                                   <button className='p-2 rounded-md hover:bg-gray-200 cursor-pointer transition-all'>
                                        <RiUnderline size={17} />
                                   </button>
                              </div>
                              <div className='flex gap-x-3 pr-2'>

                                   {/* Numbered List Button */}
                                   <button className='p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-all'>
                                        <MdOutlineFormatListNumbered size={17} />
                                   </button>

                                   {/* Dotted List Button */}
                                   <button className='p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-all'>
                                        <MdOutlineFormatListBulleted size={17} />
                                   </button>
                              </div>

                              <div className='flex gap-x-3 relative'>

                                   {/* Variable Insert Button */}
                                   <button
                                        onClick={insertVariableValue}
                                        className='p-2 rounded-md hover:bg-gray-200 cursor-pointer transition-all'>
                                        <LuCode size={17} />
                                   </button>

                                   {/* Emojis Insert Button */}
                                   <button
                                        onClick={() => {
                                             setShowEmojis(true);
                                        }}
                                        onFocus={() => {
                                             setShowEmojis(true)
                                        }}
                                        onBlur={() => {
                                             setShowEmojis(false);
                                        }}
                                        className='p-2 rounded-md hover:bg-gray-200 cursor-pointer transition-all'>
                                        <MdOutlineEmojiEmotions size={17} />
                                   </button>
                                   {
                                        showEmojis ? (
                                             <div className='rounded-xl absolute top-2  border-2 p-2 border-green-500 shadow-sm bg-white z-20'>
                                                  <EmojiPicker
                                                       searchPlaceHolder='Search Emojis...'
                                                       emojiStyle="dark"
                                                       style={{ fontSize: 12 }}
                                                       className='border-none'
                                                       onEmojiClick={(event) => dispatch(onChangeMessageBody(messageBody + event.emoji))}
                                                  />
                                             </div>
                                        )
                                             : null
                                   }
                              </div>
                         </div>
                         <div>
                              <CustomTextArea
                                   placeholder={"Type your message here..."}
                                   textAreaValue={messageBody}
                                   handleOnChangeTextArea={(e) => dispatch(onChangeMessageBody(e.target.value))}
                                   textareaName={"messageBody"}
                              />
                         </div>
                    </div>
                    <div>
                         <p className='text-sm text-gray-500 mt-1'>
                              User variables like {"{{1}}"} to personalize your messages
                         </p>
                    </div>

                    {/* Attachments like Adding Videos, Adding Images, and Adding Documents to Templates */}
                    <div className='my-5'>
                         <div>
                              <h2 className='text-gray-700 text-md font-medium'>Media Attachments {"(Optional)"}</h2>
                         </div>
                         <div className='flex flex-row items-center justify-between space-x-5'>

                              {/* Pick Image Only, with different extensions */}

                              <PickFileDynamically
                                   fileType={"image/*"}
                                   icon={
                                        <AiOutlinePlaySquare size={17} />
                                   }
                                   text={"Image"}
                                   isWidthFull={true}
                                   reference={pickImageReference}
                                   handleOnClickFile={handlePickImage}
                                   onChangeFile={handleFileType}
                              />

                              {/* Pick Videos Only, with all extensions */}
                              <PickFileDynamically
                                   fileType={"video/*"}
                                   icon={
                                        <AiOutlinePlaySquare size={17} />
                                   }
                                   text={"Video"}
                                   isWidthFull={true}
                                   reference={pickVideoReference}
                                   handleOnClickFile={handlePickVideo}
                                   onChangeFile={handleFileType}
                              />


                              {/* Pick Image Only, with different extensions */}
                              <PickFileDynamically
                                   fileType={".doc, .pdf, .docx, .csv"}
                                   icon={
                                        <IoImage size={17} />
                                   }
                                   text={"Document"}
                                   isWidthFull={true}
                                   reference={pickDocumentReference}
                                   handleOnClickFile={handlePickDocument}
                                   onChangeFile={handleFileType}
                              />

                         </div>
                    </div>


                    {/* Buttons to replace or remove from attachments to content to be previewed if any of the file was picked  */}
                    {
                         fileType !== null &&
                         <div className='flex flex-row items-end w-full justify-end gap-x-3 my-2'>
                              <button className='text-green-600 cursor-pointer hover:bg-gray-50 p-2 rounded-lg px-3 py-2 text-sm font-medium'
                                   onClick={fileType.startsWith("image/") ? handlePickImage : fileType.startsWith("application/pdf") ? handlePickDocument : handlePickVideo}>
                                   Replace
                              </button>
                              <button className='text-red-600 cursor-pointer hover:bg-gray-50 p-2 rounded-lg px-3 py-2 text-sm font-medium' onClick={() => {
                                   setFileType(null);
                                   pickImageReference(null);
                                   pickVideoReference(null);
                                   pickDocumentReference(null);
                                   if (pickDocumentReference.current) pickDocumentReference.current.value = "";
                                   if (pickImageReference.current) pickImageReference.current.value = "";
                                   if (pickVideoReference.current) pickVideoReference.current.value = "";
                              }}>Remove</button>
                         </div>
                    }

                    {/* Show or Pick Document here */}
                    <div className={`flex items-center justify-center border-dashed border-3 border-gray-300 flex-col w-auto p-5 rounded-xl gap-3`}>


                         {/* Preview Content of File that was just picked */}
                         {
                              fileType !== null && fileType.startsWith("application/pdf") ?
                                   <iframe src={fileURL} width={"100%"} height={"100%"} />
                                   :
                                   fileType !== null && fileType.startsWith("image/") ?
                                        <img src={fileURL} width={"100%"} height={"100%"} />
                                        :
                                        fileType !== null && fileType.startsWith("video/") ?
                                             <video src={fileURL} width={"100%"} height={"100%"} style={{ objectFit: "cover" }} controls autoPlay={false} />
                                             :
                                             <>
                                                  <div className='text-gray-500 bg-gray-100 rounded-full p-4 flex items-center justify-center'>
                                                       <RiUpload2Line size={20} color={"gray"} className='bg-gray-100' />
                                                  </div>
                                                  <div className='flex flex-col items-center justify-center text-gray-500'>
                                                       <span className='font-medium text-gray-700'>Drag and drop your files here</span>
                                                       <p className='text-sm'>or</p>
                                                  </div>
                                                  <PickFileDynamically
                                                       fileType={"image/pdf/png/jpg/docx/video/mp4/mkv/vvi"}
                                                       icon={""}
                                                       text={"Browse Files"}
                                                       isWidthFull={false}
                                                  />
                                                  <span
                                                       className='text-gray-400 text-sm'>
                                                       Maximum file size: 16MB. Supported formats: JPG, PNG, PDF, MP4
                                                  </span>
                                             </>
                         }
                    </div>
               </div>
          </div>
     )
}

export default MessageInformationCard
