import React, { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io';

const FilterButton = ({ title, handleClick, icon }) => {
     const [isButtonActive, setIsButtonActive] = useState(false);

     return (
          <div
               tabIndex={0}
               className={`flex items-center justify-center border-1 border-gray-300 px-3 py-2 rounded-lg text-gray-600 cursor-pointer ${isButtonActive ? "border-2 border-green-500" : "border-2 border-gray-200"} hover:bg-gray-50`} onFocus={() => setIsButtonActive(true)} onBlur={() => setIsButtonActive(false)} onClick={handleClick}>
               <div className="flex flex-row items-center justify-between gap-x-[3px]">
                    <div>
                         {icon}
                    </div>
                    <div className="text-sm text-gray-600">
                         <span>{title}</span>
                    </div>
                    <div>
                         <IoIosArrowDown />
                    </div>
               </div>
          </div>
     )
}

export default FilterButton
