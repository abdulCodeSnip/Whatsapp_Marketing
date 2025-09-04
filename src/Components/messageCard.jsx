import React from 'react'

const MessageCard = ({ userName, phoneNumber, userProfileLogo, messageStatus, msgDeliveredTime, msgSmallOverview, }) => {

     let profileBgColor = "";
     let profileTextColor = "";
     let statusTextColor = "";
     let statusBgColor = "";

     switch (messageStatus) {
          case "Delivered":
               statusBgColor = "bg-green-200";
               statusTextColor = "text-green-700";
               profileTextColor = "text-blue-700";
               profileBgColor = "bg-blue-200";
               break;

          case "Pending":
               statusBgColor = "bg-yellow-200";
               statusTextColor = "text-yellow-700";
               profileTextColor = "text-purple-700";
               profileBgColor = "bg-purple-200";
               break;

          case "Sent":
               statusBgColor = "bg-blue-200";
               statusTextColor = "text-blue-700";
               profileTextColor = "text-yellow-700";
               profileBgColor = "bg-yellow-200";
               break;

     }
     return (
          <>
               <div className="bg-white">

                    {/* Message Header with Details */}
                    <div className="flex flex-row items-center justify-between gap-x-3 space-y-2">

                         {/* Logo and Title */}
                         <div className="flex flex-row items-center gap-x-3">
                              <div>
                                   <div
                                        className={`rounded-full font-medium h-10 w-10 flex items-center justify-center text-xs whitespace-nowrap ${profileBgColor} ${profileTextColor}`}
                                   >
                                        {userProfileLogo}
                                   </div>
                              </div>

                              <div className="flex flex-col items-start justify-center" >

                                   <h2 className="font-medium text-[14px]">
                                        {
                                             userName
                                        }
                                   </h2>
                                   <h2 className="text-gray-500 text-sm">
                                        {
                                             phoneNumber
                                        }
                                   </h2>
                              </div>
                         </div>

                         {/* Message Status and Time*/}
                         <div className="flex flex-row items-center justify-between gap-x-4">
                              <div className={`${statusBgColor} rounded-full px-2 py-1`}>
                                   <div>
                                        <h2 className={`${statusTextColor} text-[10px] font-medium`} >
                                             {
                                                  messageStatus
                                             }
                                        </h2>
                                   </div>
                              </div>

                              <div>
                                   <h2 className="text-sm text-gray-600">
                                        {
                                             msgDeliveredTime
                                        }
                                   </h2>
                              </div>
                         </div>
                    </div>

                    {/* Message Text Overview with Dynamic Text */}
                    <div>
                         <div>
                              <span className="text-base text-gray-500">
                                   {
                                        msgSmallOverview
                                   }
                              </span>
                         </div>
                    </div>
               </div>
               <hr className="text-gray-200 my-2" />
          </>
     )
}

export default MessageCard
