import React from 'react'

const CustomNotificationCard = ({ notificationType, notificationContent }) => {

     return (
          <div className={`${notificationType === "Error" ? "bg-red-100 text-red-500 text-sm" : notificationType === "Success" ? "bg-green-100 text-green-500 text-sm" : "text-gray-500 bg-gray-100 text-sm"} p-3 rounded-xl shadow-sm`}>
               <h2>
                    {
                         notificationType
                    }
               </h2>
               <div>
                    <span>
                         {
                              notificationContent
                         }
                    </span>
               </div>
          </div>
     )
}

export default CustomNotificationCard
