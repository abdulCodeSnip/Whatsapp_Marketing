import React, { useState } from 'react'
import CustomInput from '../customInput'
import { LuBellRing } from 'react-icons/lu'
import { BsQuestionCircle } from 'react-icons/bs';

const Header = () => {

     const [searchInputValue, setSearchInputValue] = useState("");

     return (
          <header className='bg-white shadow-sm z-10'>
               <div className="flex flex-row items-center justify-between h-16 px-6">
                    <div>
                         <CustomInput
                              placeholder={"Search Templates...."}
                              value={searchInputValue}
                              handleOnChange={(e) => setSearchInputValue(e.target.value)}
                              name={"searchTemplates"}
                         />
                    </div>
                    <div className="flex flex-row items-center justify-between gap-x-7">
                         <div>
                              <span className='px-3 py-1 text-sm  font-medium rounded-full bg-green-100 text-green-500'>Connected</span>
                         </div>
                         <div className='cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-shadow text-gray-400'>
                              <LuBellRing size={20} />
                         </div>

                         <div className='cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-shadow text-gray-400'>
                              <BsQuestionCircle size={20} />
                         </div>
                    </div>

               </div>
          </header>
     )
}

export default Header
