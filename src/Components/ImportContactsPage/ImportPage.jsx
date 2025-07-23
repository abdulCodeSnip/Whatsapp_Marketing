import React from 'react'
import SideBar from '../SideBar'
import Header from '../CreateNewTemplatePage/Header'
import Hamburger from './Hamburger'
import ImportContactsSequence from './ImportContactsSequence'

const ImportPage = () => {
    return (
        <>
            <div className='flex h-screen overflow-hidden'>
                {/* Sidebar for the screen */}
                <SideBar />

                {/* Header and the Main content of the screen */}
                <div className='flex flex-1 flex-col h-screen overflow-hidden'>

                    {/* Header of the screen */}
                    <Header />

                    {/* Main Content of the screen */}
                    <main className='flex-1 flex-col h-screen p-6 bg-gray-50 overflow-y-auto'>
                        <div className='max-w-7xl mx-auto'>
                            <Hamburger />
                            <ImportContactsSequence />
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default ImportPage