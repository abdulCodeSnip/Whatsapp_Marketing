import React from 'react'
import { Link } from 'react-router-dom'

const CustomLinkButton = ({ title, href, buttonIcon }) => {
     return (
          <>
               <div>

                    {/* Link to redirect user to a specific screen */}
                    <Link
                         to={href}
                         className="flex flex-row bg-white border-1 shadow-sm border-gray-200 p-4 rounded-md gap-x-4 items-center justify-center w-full hover:bg-gray-50">
                         <div>
                              {
                                   buttonIcon
                              }
                         </div>

                         <div>
                              <h2 className="text-[17px] text-gray-700 font-medium">
                                   {
                                        title
                                   }
                              </h2>
                         </div>
                    </Link>
               </div>
          </>
     )
}

export default CustomLinkButton
