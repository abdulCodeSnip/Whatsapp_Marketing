import React, { useEffect, useState } from 'react'
import { BiShare } from "react-icons/bi";
import { PiShareFatBold } from "react-icons/pi";
import { RiDeleteBin4Line } from "react-icons/ri";



const FullMessageOverview = ({
     contactName, messageText,
     contactPhoneNumber, messageStatus,
     messageDate, messageTimeStamp,
     deleteMessage, replyToMessage, forwardMessage, isAllChecked, handleCheckBox
}) => {

     const [userAvatar, setUserAvatar] = useState("");
     const [avatarBg, setAvatarBg] = useState("");

     // Functions to get Random and Dyamic background color
     const getRandomBackgroundColor = (colors) => {
          let randomSelectedIndex = Math.floor(Math.random() * (colors.length) + 1);
          if (randomSelectedIndex < 1) {
               randomSelectedIndex + 1;
          }
          return colors[randomSelectedIndex];
     }

     const changeAvatar = () => {
          setUserAvatar(contactName.split(" ")[0].charAt(0).toUpperCase() + contactName.split(" ")[1].charAt(0).toUpperCase());
          const colors = ["green", "purple", "blue", "yellow", "pink", "gray", "orange", "brown", "cyan", "black", "white"];
          setAvatarBg(getRandomBackgroundColor(colors));
     }

     useEffect(() => {
          changeAvatar();
     }, []);



     // Changing the status background color based on the delivery status
     let statusBgColor = "";
     let statusTextColor = "";

     switch (messageStatus) {
          case "Delivered":
               statusBgColor = "bg-green-100";
               statusTextColor = "text-green-600";
               break;
          case "Sent":
               statusBgColor = "bg-blue-100";
               statusTextColor = "text-blue-600";
               break;
          case "Pending":
               statusBgColor = "bg-yellow-100";
               statusTextColor = "text-yellow-600";
               break;
          case "Scheduled":
               statusBgColor = "bg-blue-100";
               statusTextColor = "text-blue-600";
               break;
          default:
               statusBgColor = "bg-gray-200";
               statusTextColor = "text-gray-600";
               break;
     }


     return (
          <tr className="hover:bg-gray-50">
               {/* Checkbox to check all the messages. */}
               <td className="px-6 py-4 whitespace-nowrap ">
                    <input type="checkbox" id="checkboxForSelectingMessages" name="checkboxForSelectingMessages" checked={isAllChecked} onChange={handleCheckBox} className='accent-green-600 h-[18px] w-[18px] cursor-pointer' />
               </td>

               {/* Contact information with name and phone number */}
               <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">

                         {/* User Profile Logo with some text*/}
                         <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium  bg-${avatarBg}-200 text-${avatarBg}-700`}>
                              {userAvatar}
                         </div>
                         <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                   {contactName}
                              </div>
                              <div className="text-sm text-gray-500">
                                   {contactPhoneNumber}
                              </div>
                         </div>
                    </div>
               </td>

               {/* Message Overview */}
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                    {messageText}
               </td>

               {/* Status Overview, with a status e.g(Delivered, pending, sent)*/}
               <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${statusBgColor} ${statusTextColor}`}>
                         {
                              messageStatus
                         }
                    </span>
               </td>

               {/* Recieving or sending date of a message, with time */}
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* Date */}
                    <div>
                         {messageDate}
                    </div>
                    {/* time */}
                    <div className="text-xs text-gray-400">
                         {messageTimeStamp}
                    </div>
               </td>

               {/* Actions */}
               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">

                    {/* Replay Button */}
                    <button className="text-gray-400 p-2 rounded-full hover:bg-gray-200 hover:text-gray-600 cursor-pointer" onClick={replyToMessage}>
                         <BiShare />
                    </button>

                    {/* Forward Button */}
                    <button className="text-gray-400 p-2 rounded-full hover:bg-gray-200 hover:text-gray-600 cursor-pointer" onClick={forwardMessage}>
                         <PiShareFatBold />
                    </button>

                    {/* Delete Button */}
                    <button className="text-gray-400 p-2 rounded-full hover:bg-gray-200 hover:text-gray-600 cursor-pointer" onClick={deleteMessage}>
                         <RiDeleteBin4Line />
                    </button>
               </td>
          </tr>
     )
}

export default FullMessageOverview
