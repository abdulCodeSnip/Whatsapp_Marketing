import React, { useEffect, useState } from 'react'
import { BiSend } from 'react-icons/bi'
import { FaLink } from 'react-icons/fa'
import { IoIosLink } from 'react-icons/io'
import { LuSend } from 'react-icons/lu'
import { MdEmojiEmotions, MdOutlineEmojiEmotions } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { inputChangesForSendingMessage } from '../../redux/chatHistoryPage/chats'

const ChatFooter = () => {

    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
    const selectedUser = useSelector((state) => state?.selectedContact);
    const messageFromStore = useSelector((state) => state?.dynamicChats?.messageText);
    const dispatch = useDispatch();
    console.log(selectedUser);

    const [message, setMessage] = useState("");

    const sendMessageToCurrentUser = async (receiverId) => {
        try {
            const apiResponse = await fetch(`${authInformation?.baseURL}/messages/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authInformation?.token
                },
                body: JSON.stringify({ receiver_id: receiverId, content: message })
            });

            const result = await apiResponse.json();
            if (apiResponse.ok) {
                console.log("Sent!", result);

                // ✅ Only now update chat in Redux
                dispatch(dynamicChats({
                    content: message,
                    from: "me",
                    updated_at: new Date().toISOString(),
                    scheduled_at: null,
                    status: "sent"
                }));

                setMessage(""); // clear input after sending
            } else {
                console.log("Bad request.");
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };


    return (
        <div className='p-5 border-t border-gray-200 bg-white shadow-xl'>
            <div className='flex flex-row gap-4 '>
                <button className='cursor-pointer p-2 rounded-full hover:bg-gray-50 transition-all'>
                    <MdOutlineEmojiEmotions size={20} color='gray' />
                </button>
                <button className='cursor-pointer p-2 rounded-full hover:bg-gray-50 transition-all'>
                    <IoIosLink size={20} color='gray' />
                </button>
                <div className='w-full'>
                    <input type="text" value={message} onChange={(e) => {
                        setMessage(e.target.value);

                    }} placeholder='Type a message....' className='px-3 py-2 rounded-xl border border-gray-200 outline-green-500 w-full' />
                </div>
                <button disabled={message.trim() === ""} onClick={() => {
                    sendMessageToCurrentUser(selectedUser?.id);
                    setMessage("");
                    dispatch(inputChangesForSendingMessage(message))
                }
                } className='p-2 disabled:opacity-80 rounded-full bg-green-500 cursor-pointer'>
                    <LuSend size={25} color='white' />
                </button>
            </div>
        </div>
    )
}

export default ChatFooter