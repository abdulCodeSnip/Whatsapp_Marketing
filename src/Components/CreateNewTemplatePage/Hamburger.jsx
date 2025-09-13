import React from 'react'
import { BiPlus } from 'react-icons/bi'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { TbLayoutDashboard } from 'react-icons/tb'
import { Link } from 'react-router-dom'

const Hamburger = ({ firstLink, secondLink, thirdLink }) => {
     return (
          <>
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

               {/* Useful message for admin */}
               <div className='my-5 flex flex-col md:flex-row space-y-2 justify-between items-center'>
                    <div>
                         <div>
                              <h2 className='font-semibold text-2xl'>
                                   Templates
                              </h2>
                         </div>
                         <div className='text-gray-600 text-sm'>
                              <span>Manage your Whatsapp message templates for campaigns and automations</span>
                         </div>
                    </div>

                    <div className='ml-auto'>
                         <Link to={"/templates/create-new-template"} className='flex flex-row items-center justify-center gap-x-2 p-2 bg-[#25D366] text-white font-medium text-sm shadow-sm rounded-lg px-4 py-2'>
                              <BiPlus size={20} />
                              <span>Create New Template</span>
                         </Link>
                    </div>
               </div>
          </>

     )
}

export default Hamburger
