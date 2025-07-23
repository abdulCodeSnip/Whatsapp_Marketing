import React from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { TbLayoutDashboard } from 'react-icons/tb'
import { Link } from 'react-router-dom'

const Hamburger = () => {

    return (
        <>
            <div className='flex flex-row gap-x-3 justify-between items-center'>
                <div className="flex flex-row items-center justify-center gap-x-4">
                    <Link to={"/contacts"} className='text-gray-800 bg-white p-2 rounded-full shadow-gray-300 shadow-sm'>
                        <BiArrowBack size={20} />
                    </Link>
                    <div>
                        <h2 className='text-2xl font-bold tracking-wide text-gray-800'>Import Contacts</h2>
                    </div>
                </div>

                <div>
                    <Link to={"/"} className='flex flex-row items-center justify-center gap-x-2 rounded-lg bg-white px-3 py-2 border-gray-300 shadow-gray-300 shadow-sm border'>
                        <BiArrowBack size={20} />
                        <span>Back to Dashabord</span>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Hamburger