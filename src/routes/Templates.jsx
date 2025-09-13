import React, { useState } from 'react'
import SideBar from '../Components/SideBar';
import Hamburger from '../Components/CreateNewTemplatePage/Hamburger';
import Header from '../Components/ContactsManagementPage/Header';
import AllTemplatesTable from '../Components/TemplatesPage/AllTemplatesTable';

const Templates = () => {
     const [sidebarOpen, setSidebarOpen] = useState(false);
     // the function "HandleSearchTemplates, works for sorting the templates based on "search value", "changing of options in Category", "changing of options in Status", and even, it can handle the "Reset Button to reset all filters, and return the total value, removing all the filters" "
     return (

          <>
               <div className="flex overflow-hidden h-screen">
                    {/* Sidebar at left side */}
                    <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                    {/* Main Content with a header and with all main content about messages */}
                    <div className="flex-1 flex flex-col h-screen overflow-hidden">

                         {/* Header of the "Templates for user convinience" */}
                         <Header onMenuClick={() => setSidebarOpen(true)} />

                         {/* Main content that would be shown on the screen */}
                         <main className='flex-1 p-6 bg-gray-50 overflow-y-auto'>

                              {/* Main content */}
                              <div className='max-w-7xl mx-auto'>

                                   {/* Useful message for admin, and few icons */}
                                   <Hamburger firstLink={"Dashboard"} secondLink={"Templates"} />

                                   <AllTemplatesTable />
                              </div>
                         </main>
                    </div>
               </div>
          </>

     )
}

export default Templates
