import React, { useState } from 'react'
import SideBar from '../Components/SideBar'
import Header from '../Components/SendNewMessage/Header'
import AddRecipentsToMessage from '../Components/SendNewMessage/AddRecipentsToMessage'

const SendNewMessage = () => {

    return (
        <div className='h-screen overflow-hidden flex'>

            {/* Side bar for the screen */}
            <SideBar />

            {/* Content with header */}
            <div className='flex flex-1 flex-col overflow-hidden'>
                <Header />
                <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <AddRecipentsToMessage />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default SendNewMessage