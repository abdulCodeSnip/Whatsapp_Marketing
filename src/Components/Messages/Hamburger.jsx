import React from 'react'
import { RiSendPlaneLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'

const Hamburger = () => {
    return (
        <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
                <div>
                    <h2 className="font-bold text-2xl text-gray-800">All Messages</h2>
                </div>
                <div>
                    <span className="text-gray-500 text-[14.5px]">
                        View and manage all your WhatsApp messages in one place
                    </span>
                </div>
            </div>
            <div>
                <Link to={"/componse-new-message"} className="flex flex-row items-center justify-center bg-green-400 text-white rounded-lg font-medium text-sm px-4 py-3 hover:opacity-90 gap-2">
                    <RiSendPlaneLine size={20} />
                    <span>Send New Message</span>
                </Link>
            </div>
        </div>
    )
}

export default Hamburger