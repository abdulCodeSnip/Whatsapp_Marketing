
import React from "react";

const CampaignCard = ({ title, status, progress, footer }) => {


     // Dynamic Colors for Each Status Background
     let statusBgColor = "";
     let statusTextColor = "";
     let progressBgColor = "";

     switch (status) {
          case "Active":
               statusBgColor = "bg-green-200";
               statusTextColor = "text-green-700";
               progressBgColor = "bg-green-500";
               break;

          case "Completed":
               statusBgColor = "bg-gray-200";
               statusTextColor = "text-gray-700";
               progressBgColor = "bg-gray-500";

               break;
          case "Pending":
               statusBgColor = "bg-yellow-200";
               statusTextColor = "text-yellow-700";
               progressBgColor = "bg-gray-200";
               break;

          case "Scheduled":
               statusBgColor = "bg-blue-200";
               statusTextColor = "text-blue-700";
               progressBgColor = "bg-gray-200";
               break;

          default:
               break;
     }




     return (
          <div className="flex flex-col mt-3 gap-y-3">
               <div className="flex flex-row items-center justify-between">
                    <div>
                         <h2 className="font-medium text-sm">
                              {
                                   title
                              }
                         </h2>
                    </div>

                    {/* Status for a campaign section */}
                    <div>
                         <div className={`${statusBgColor} rounded-xl px-2 py-1 flex items-center justify-center flex-row`}>
                              <span className={`${statusTextColor} text-[10px] font-medium`}>
                                   {
                                        status
                                   }
                              </span>
                         </div>
                    </div>
               </div>

               {/* Progress Bar to show Progress Activity  */}
               <div>
                    <div className="flex flex-row bg-gray-300 w-full h-2.5 my-2 rounded-2xl">
                         <div className={`rounded-full ${progressBgColor}`} style={{ width: progress + "%" }}>
                         </div>
                    </div>

                    <div className="flex flex-row items-center justify-between">
                         <div>
                              <span className="text-xs text-gray-500 font-medium">{footer}</span>
                         </div>
                         <div>
                              <span className="text-xs text-gray-500 font-medium">{progress}%</span>
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default CampaignCard
