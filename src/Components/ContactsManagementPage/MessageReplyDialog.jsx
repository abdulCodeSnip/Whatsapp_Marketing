import React from 'react'

const MessageReplyDialog = ({ contactName, contactPhone, closeDialog, sendMessage }) => {

    const contactUpperCase = contactName?.trim()?.split(" ").at(0)?.charAt(0)?.toUpperCase() +
        contactName?.trim()?.split(" ").at(1)?.charAt(0).toUpperCase();
    return (
        <div className='bg-white rounded-xl divide-y divide-gray-300 shadow-sm'>

            {/* Reply Message Header*/}
            <div className='flex flex-row justify-between items-center'>

                {/* Contact Avatar */}
                <div className='flex flex-row items-center justify-start'>
                    <div className='bg-purple-100 rounded-full p-2 text-purple-600 font-medium'>
                        <h2>{contactUpperCase}</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageReplyDialog