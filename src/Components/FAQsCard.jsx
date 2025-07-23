import React from 'react'
import CustomInput from './customInput'
import { IoClose } from 'react-icons/io5';
import { AiOutlinePlaySquare } from 'react-icons/ai';
import { TfiHeadphone } from 'react-icons/tfi';

const FAQsCard = ({ closeFAQs, changeFAQsSearchInput, setChangeFAQsSearchInput }) => {

     return (
          <div className="fixed top-[14%] right-[21%] w-[650px] space-y-2  bg-white border border-gray-300 rounded-2xl shadow-lg z-50">
               <div className="flex flex-row items-center justify-between p-5">
                    <div>
                         <h2 className="text-lg font-semibold">
                              Help Center
                         </h2>
                    </div>
                    <div className="text-gray-600 hover:bg-gray-200 p-2 rounded-xl cursor-pointer" onClick={closeFAQs}>
                         <IoClose size={20} />
                    </div>
               </div>
               <hr className="text-gray-200" />
               <div className="p-4">
                    <CustomInput
                         placeholder={"Search Knowledge base...."}
                         value={changeFAQsSearchInput}
                         handleOnChange={(e) => setChangeFAQsSearchInput(e.target.value)}
                         name={"faqSearchInput"} />
               </div>

               {/* Common FAQs and Some video tutorial Options for Admin convinience */}

               <div className="flex flex-row justify-between p-5 items-start gap-x-5">
                    <div className="flex flex-col gap-4 justify-center">
                         <h2 className="text-gray-800 font-semibold text-lg">
                              Common FAQs
                         </h2>
                         <div className="bg-gray-100 p-3 rounded-xl text-sm cursor-pointer">
                              <h2 className="text-gray-700 font-medium">
                                   How do I create new Campaign ?
                              </h2>
                         </div>
                         <div className="bg-gray-100 p-3 rounded-xl text-sm cursor-pointer">
                              <h2 className="text-gray-700 font-medium">
                                   How to import contacts ?
                              </h2>
                         </div>
                         <div className="bg-gray-100 p-3 rounded-xl text-sm cursor-pointer">
                              <h2 className="text-gray-700 font-medium">
                                   Messages Template Guide
                              </h2>
                         </div>
                    </div>

                    <div className="flex flex-col gap-4 items-start justify-center">
                         <h2 className="text-gray-800 font-semibold text-lg">Video Tutorials</h2>

                         <div className="bg-gray-100 p-3 rounded-xl text-sm cursor-pointer flex flex-row gap-2 items-center w-full">
                              <div className="bg-green-100 p-2 rounded-lg">
                                   <AiOutlinePlaySquare size={17} color="green" />
                              </div>
                              <h2 className="text-gray-800 font-medium">
                                   Getting Started Guide
                                   <p className="text-xs text-gray-500 font-medium mb-2">5 min</p>
                              </h2>
                         </div>
                         <div className="bg-gray-100 p-3 rounded-xl text-sm cursor-pointer flex flex-row gap-2 items-center">
                              <div className="bg-green-100 p-2 rounded-lg">
                                   <AiOutlinePlaySquare size={17} color="green" />
                              </div>
                              <h2 className="text-gray-800 font-medium">
                                   Campaign Creating Tutorial
                                   <p className="text-xs text-gray-500 font-medium mb-2">8 min</p>
                              </h2>
                         </div>
                    </div>
               </div>

               {/* Button at last of the FAQs */}
               <div className="flex items-center justify-center my-5 ">
                    <button className="flex flex-row bg-green-500 cursor-pointer gap-x-2 p-2 items-center justify-center rounded-lg">
                         <TfiHeadphone size={16} color="white" />
                         <h2 className="font-medium text-sm text-white">Contact Support</h2>
                    </button>
               </div>
          </div>
     )
}

export default FAQsCard
