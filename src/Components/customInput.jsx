import React, { useState } from 'react'
import { CiSearch } from 'react-icons/ci';

const CustomInput = ({ name, value, handleOnChange, placeholder, }) => {

     const [isInputActive, setIsInputActive] = useState(false);

     return (
          <div className={`flex items-center tracking-wide bg-gray-100 px-2 py-1.5 border-[2px] rounded-xl ${isInputActive ?   " border-green-500" : "border-white"}`}>
               <div className="flex flex-row items-center gap-3 w-full">
                    <CiSearch size={20} color="gray" />
                    <input
                         type="text"
                         value={value}
                         placeholder={placeholder}
                         name={name}
                         className="outline-none text-gray-700 flex w-full"
                         onChange={handleOnChange}
                         id={name}
                         onFocus={() => setIsInputActive(true)}
                         onBlur={() => setIsInputActive(false)}
                    />
               </div>
          </div>
     )
}

export default CustomInput
