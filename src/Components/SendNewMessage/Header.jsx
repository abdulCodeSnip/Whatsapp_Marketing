import React from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header className='bg-white shadow-sm z-10'>
            <div className='flex flex-row items-center justify-between px-6 h-16'>
                <div className='flex flex-row items-center gap-x-3'>
                    <Link to={"/"} className='flex flex-row items-center gap-x-2 text-sm font-medium text-gray-500 hover:text-gray-700'>
                        <BiArrowBack />
                        <span>Back to Dashboard</span>
                    </Link>
                    <div className='text-lg font-medium text-gray-900'>
                        <h2>New Message</h2>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-x-4 justify-center">
                    <button className="flex items-center font-medium text-gray-600 text-sm justify-center px-3 py-2 rounded-lg border border-gray-400 bg-white hover:bg-gray-50 cursor-pointer transition-all">
                        Save as Draft
                    </button>
                    <div className="flex items-center px-2 py-1 rounded-full bg-green-100 text-green-600 font-medium text-xs">
                        <span>Connected</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header