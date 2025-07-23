import React from 'react'
import { IoMdArrowRoundUp } from "react-icons/io";


const DashboardCard = ({ cardHeader, cardInternalValue, cardFooter, growthDownPercentage, cardIcon, iconBackgroundColor, }) => {
     return (
          <div className="bg-white px-6 py-4 shadow-xs rounded-2xl space-y-3">
               <div className='flex flex-row items-center justify-around '>
                    {/* Card Dynamic Icon */}
                    <div className={`p-3.5 rounded-2xl`} style={{ backgroundColor: iconBackgroundColor }}>
                         {cardIcon}
                    </div>
                    <div className='flex flex-col'>
                         <div>
                              <h2 className='text-[15px] text-gray-400 font-semibold'>
                                   {
                                        cardHeader
                                   }
                              </h2>
                         </div>
                         <div>
                              <h2 className="font-semibold text-2xl">
                                   {
                                        cardInternalValue
                                   }
                              </h2>
                         </div>
                    </div>
               </div>

               {/* Growth / Down Percentage with Footer*/}
               <div className="flex flex-row justify-start items-center gap-7">
                    <div className='flex flex-row items-center justify-center space-x-2'>
                         <IoMdArrowRoundUp color='green' size={14} />
                         <h2 className="text-green-500 text-xs font-semibold">
                              {
                                   growthDownPercentage
                              }
                         </h2>
                    </div>
                    <div className="">
                         <span className="text-gray-400 text-xs font-semibold text-start">
                              {
                                   cardFooter
                              }
                         </span>
                    </div>
               </div>
          </div>
     )
}

export default DashboardCard
