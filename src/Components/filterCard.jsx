import React, { useState, useEffect } from 'react'
import ClickableCustomButton from './clickableCustomButton';

const FilterCard = ({ 
     filterName, 
     dateFilter, 
     onApplyDateFilter, 
     statusFilter, 
     onApplyStatusFilter, 
     sortBy, 
     onApplySortFilter 
}) => {

     const [isButtonActive, setIsButtonActive] = useState(false);
     const [localStartDate, setLocalStartDate] = useState(dateFilter?.startDate || '');
     const [localEndDate, setLocalEndDate] = useState(dateFilter?.endDate || '');

     // Sync local state with prop changes
     useEffect(() => {
          setLocalStartDate(dateFilter?.startDate || '');
          setLocalEndDate(dateFilter?.endDate || '');
     }, [dateFilter]);

     const handleApplyDateFilter = () => {
          onApplyDateFilter(localStartDate, localEndDate);
     };

     const handleStatusChange = (statusType, checked) => {
          onApplyStatusFilter(statusType, checked);
     };

     const handleSortOptionClick = (sortType) => {
          onApplySortFilter(sortType);
     };

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
                                             value={localStartDate}
                                             onChange={(e) => setLocalStartDate(e.target.value)}
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
                                             value={localEndDate}
                                             onChange={(e) => setLocalEndDate(e.target.value)}
                                             className="text-gray-700 border-gray-200 p-2 border-1 rounded-xl"
                                        />
                                   </div>
                              </div>

                              {/* Button aligned to flex-end */}
                              <div className="flex justify-end">
                                   <button 
                                        onClick={handleApplyDateFilter}
                                        className="text-white font-medium text-xs bg-green-500 rounded-lg px-4 py-2 hover:opacity-90 cursor-pointer">
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
                                                  <div
                                                       className={`text-sm px-3 py-2 w-[100%] font-medium cursor-pointer hover:bg-gray-100 rounded-md my-[2px] ${sortBy === 'byNewestDate' ? 'bg-green-100 text-green-700' : 'text-gray-400'}`}
                                                       onClick={() => handleSortOptionClick('byNewestDate')}>
                                                       Date (Newest First)
                                                  </div>

                                                  <div
                                                       className={`text-sm px-3 py-2 w-[100%] font-medium cursor-pointer hover:bg-gray-100 rounded-md my-[2px] ${sortBy === 'byOldestDate' ? 'bg-green-100 text-green-700' : 'text-gray-400'}`}
                                                       onClick={() => handleSortOptionClick('byOldestDate')}>
                                                       Date (Oldest First)
                                                  </div>

                                                  <div
                                                       className={`text-sm px-3 py-2 w-[100%] font-medium cursor-pointer hover:bg-gray-100 rounded-md my-[2px] ${sortBy === 'byStatus' ? 'bg-green-100 text-green-700' : 'text-gray-400'}`}
                                                       onClick={() => handleSortOptionClick('byStatus')}>
                                                       Status
                                                  </div>

                                                  <div
                                                       className={`text-sm px-3 py-2 w-[100%] font-medium cursor-pointer hover:bg-gray-100 rounded-md my-[2px] ${sortBy === 'byContactNameAsc' ? 'bg-green-100 text-green-700' : 'text-gray-400'}`}
                                                       onClick={() => handleSortOptionClick('byContactNameAsc')}>
                                                       Contact name (A-Z)
                                                  </div>

                                             </div>
                                        </div> :
                                        <div className='flex flex-col font-[450] text-sm text-gray-800'>
                                             <div className='flex flex-row items-center gap-x-1 cursor-pointer p-2 rounded-lg hover:bg-gray-100'>
                                                  <input
                                                       type="checkbox"
                                                       id="allStatus"
                                                       name="allStatus"
                                                       checked={statusFilter?.all || false}
                                                       onChange={(e) => handleStatusChange('all', e.target.checked)}
                                                       className="accent-green-600 outline-none border cursor-pointer border-gray-200 w-[17px] h-[17px] rounded-lg"
                                                  />
                                                  <label htmlFor="allStatus" className='cursor-pointer w-[130px]'>All</label>
                                             </div>

                                             <div className='flex flex-row items-center gap-x-1 cursor-pointer p-2 rounded-lg hover:bg-gray-100'>
                                                  <input
                                                       type="checkbox"
                                                       id="deliveredStatus"
                                                       name="deliveredStatus"
                                                       checked={statusFilter?.delivered || false}
                                                       onChange={(e) => handleStatusChange('delivered', e.target.checked)}
                                                       className="accent-green-600 outline-none border cursor-pointer border-gray-200 w-[17px] h-[17px] rounded-lg"
                                                  />
                                                  <label htmlFor="deliveredStatus" className='cursor-pointer w-[130px]'>Delivered</label>
                                             </div>

                                             <div className='flex flex-row items-center gap-x-1 cursor-pointer p-2 rounded-lg hover:bg-gray-100'>
                                                  <input
                                                       type="checkbox"
                                                       id="pendingStatus"
                                                       name="pendingStatus"
                                                       checked={statusFilter?.pending || false}
                                                       onChange={(e) => handleStatusChange('pending', e.target.checked)}
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
                                                       checked={statusFilter?.read || false}
                                                       onChange={(e) => handleStatusChange('read', e.target.checked)}
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
