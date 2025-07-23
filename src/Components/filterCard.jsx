import React, { useState } from 'react'
import ClickableCustomButton from './clickableCustomButton';

const FilterCard = ({ filterName, filteringOptions, isAllChecked }) => {

     const [isButtonActive, setIsButtonActive] = useState(false);

     return (
          <div className={`bg-white p-3 rounded-lg shadow-md border-gray-200 ${isButtonActive ? "border-green-500" : "border-gray-300 "} flex ${filterName !== "Date Range" ? "flex-row" : "flex-col"}items-center justify-between`}>
               {
                    filterName === "Date Range" ?

                         // if the given name to a button is "Date Range, it means we should render the dates"
                         <div className="flex flex-col gap-y-4 p-3">
                              {/* Row with date inputs */}
                              <div className="flex flex-row items-center justify-between gap-x-4">
                                   {/* Start Date Option */}
                                   <div className="flex flex-col items-start gap-y-2">
                                        <h2 className='text-xs font-medium text-gray-700'>Start Date</h2>
                                        <input
                                             type="date"
                                             name="startDate"
                                             id="startDate"
                                             className="text-gray-700 border-gray-200 p-2 border-1 rounded-xl"
                                        />
                                   </div>

                                   {/* End Date Option */}
                                   <div className="flex flex-col items-start gap-y-2">
                                        <h2 className='text-xs font-medium text-gray-700'>End Date</h2>
                                        <input
                                             type="date"
                                             name="endDate"
                                             id="endDate"
                                             className="text-gray-700 border-gray-200 p-2 border-1 rounded-xl"
                                        />
                                   </div>
                              </div>

                              {/* Button aligned to flex-end */}
                              <div className="flex justify-end">
                                   <button className="text-white font-medium text-xs bg-green-500 rounded-lg px-4 py-2 hover:opacity-90 cursor-pointer">
                                        Apply Filters
                                   </button>
                              </div>
                         </div>

                         :
                         <div>
                              {
                                   filterName === "Sort By" ?
                                        <div>
                                             <div>
                                                  <option
                                                       className="text-gray-400 text-sm px-3 py-2 w-[100%] font-medium cursor-pointer hover:bg-gray-100 rounded-md my-[2px]"
                                                       value="byNewestDate">
                                                       Date (Newest First)
                                                  </option>

                                                  <option
                                                       className="text-gray-400 text-sm px-3 py-2 w-[100%] font-medium cursor-pointer hover:bg-gray-100 rounded-md my-[2px]"
                                                       value="byOldestDate">
                                                       Date (Oldest First)
                                                  </option>

                                                  <option
                                                       className="text-gray-400 text-sm px-3 py-2 w-[100%] font-medium cursor-pointer hover:bg-gray-100 rounded-md my-[2px]"
                                                       value="byStatus">
                                                       Status
                                                  </option>

                                                  <option
                                                       className="text-gray-400 text-sm px-3 py-2 w-[100%] font-medium cursor-pointer hover:bg-gray-100 rounded-md my-[2px]"
                                                       value="byContactNameAsc">
                                                       Contact name (A-Z)
                                                  </option>

                                             </div>
                                        </div> :
                                        <div className='flex flex-col font-[450] text-sm text-gray-800'>
                                             <div className='flex flex-row items-center gap-x-1 cursor-pointer p-2 rounded-lg hover:bg-gray-100'>
                                                  <input
                                                       type="checkbox"
                                                       id="allStatus"
                                                       name="allStatus"
                                                       className="accent-green-600 outline-none border cursor-pointer border-gray-200 w-[17px] h-[17px] rounded-lg"
                                                  />
                                                  <label htmlFor="allStatus" className='cursor-pointer w-[130px]'>All</label>
                                             </div>

                                             <div className='flex flex-row items-center gap-x-1 cursor-pointer p-2 rounded-lg hover:bg-gray-100'>
                                                  <input
                                                       type="checkbox"
                                                       id="deliveredStatus"
                                                       name="deliveredStatus"
                                                       className="accent-green-600 outline-none border cursor-pointer border-gray-200 w-[17px] h-[17px] rounded-lg"
                                                  />
                                                  <label htmlFor="deliveredStatus" className='cursor-pointer w-[130px]'>Delivered</label>
                                             </div>

                                             <div className='flex flex-row items-center gap-x-1 cursor-pointer p-2 rounded-lg hover:bg-gray-100'>
                                                  <input
                                                       type="checkbox"
                                                       id="pendingStatus"
                                                       name="pendingStatus"
                                                       className="accent-green-600 outline-none border cursor-pointer border-gray-200 w-[17px] h-[17px] rounded-lg"
                                                  />
                                                  <label htmlFor="pendingStatus" className='cursor-pointer w-[130px]'>Pending</label>
                                             </div>

                                             <div>
                                                  <div className='flex flex-row items-center gap-x-1 cursor-pointer p-2 rounded-lg hover:bg-gray-100'>
                                                  <input
                                                       type="checkbox"
                                                       id="readStatus"
                                                       name="readStatus"
                                                       className="accent-green-600 outline-none border cursor-pointer border-gray-200 w-[17px] h-[17px] rounded-lg"
                                                  />
                                                  <label htmlFor="readStatus" className='cursor-pointer w-[130px]'>Read</label>
                                             </div>
                                             </div>
                                        </div>
                              }
                         </div>
               }
          </div>
     )
}

export default FilterCard
