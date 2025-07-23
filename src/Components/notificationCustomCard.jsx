import React from 'react'

const NotificationCustomCard = ({ title, time, footer }) => {
     return (
          <div className="flex flex-col p-3 cursor-pointer">
               <div className="flex flex-row items-center justify-between">
                    <div>
                         <h2 className="text-sm text-gray-900 font-medium">
                              {
                                   title
                              }
                         </h2>
                    </div>
                    <div>
                         <span className="text-sm text-gray-500">
                              {time}
                         </span>
                    </div>
               </div>

               <div className="mt-1">
                    <span className="text-gray-600 text-sm">
                         {
                              footer
                         }
                    </span>
               </div>
          </div>
     )
}

export default NotificationCustomCard