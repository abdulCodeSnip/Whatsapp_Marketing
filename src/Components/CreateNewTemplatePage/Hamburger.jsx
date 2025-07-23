import React from 'react'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { TbLayoutDashboard } from 'react-icons/tb'
import { Link } from 'react-router-dom'

const Hamburger = ({ firstLink, secondLink, thirdLink }) => {
     return (
          <div className='flex flex-row gap-x-3'>
               {
                    firstLink !== "" &&
                    (
                         <Link className='flex flex-row items-center gap-x-[1px] tracking-wide justify-center font-medium text-gray-500 hover:text-gray-700 text-sm' to={"/"}>
                              <TbLayoutDashboard size={15} className='mx-1' />
                              <h2>{firstLink}</h2>
                         </Link>
                    )
               }

               {
                    secondLink !== "" && (

                         <Link to={"/templates"} className='text-gray-500 tracking-wide flex flex-row items-center font-medium justify-center text-sm hover:text-gray-700'>
                              <MdOutlineKeyboardArrowRight size={15} />
                              <h2>{secondLink}</h2>
                         </Link>
                    )
               }
               {
                    thirdLink &&
                    (
                         <div className='text-gray-700 text-sm tracking-wide flex flex-row items-center font-medium justify-center text-[14.5px]'>
                              <MdOutlineKeyboardArrowRight size={15} />
                              <h2>{thirdLink}</h2>
                         </div>
                    )
               }
          </div>
     )
}

export default Hamburger
