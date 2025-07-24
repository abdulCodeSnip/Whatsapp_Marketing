import React, { useEffect, useState } from 'react'
import { FaCheck, FaHistory } from 'react-icons/fa';
import { MdAccessTime, MdOutlineEmojiEmotions, MdOutlineWatchLater } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux'
import { dynamicChats } from '../../redux/chatHistoryPage/chats';
import { BiCheckDouble, BiSend } from 'react-icons/bi';
import { IoWatchOutline } from 'react-icons/io5';
import { FiPaperclip } from 'react-icons/fi';
import { RiSendPlaneFill } from 'react-icons/ri';

const Chats = () => {
    const [dynamicChats, setDynamicChats] = useState({ chat: [] });
    const [newMessage, setNewMessage] = useState("");


    // Values from Redux Toolkit
    const allChats = useSelector((state) => state?.dynamicChats?.allChats);
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
    const currentUserToConversate = useSelector((state) => state?.selectedContact?.selectedContact);
    const dispatch = useDispatch();



    useEffect(() => {
        if (allChats?.chat) {
            setDynamicChats(allChats);
        } else {
            setDynamicChats({ chat: [] }); // fallback
        }
    }, [allChats]);

    const handleUpdatedMessages = async () => {

        try {
            const newChatMessage = {
                from: "me",
                content: newMessage,
                status: "sent",
            };
            const apiResponse = await fetch(`${authInformation?.baseURL}/messages/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authInformation?.token
                },
                body: JSON.stringify({
                    receiver_id: currentUserToConversate?.id,
                    content: newMessage,
                })
            });

            const apiResult = await apiResponse.json();
            setDynamicChats((previousChats) => ({
                ...previousChats,
                chat: [...(previousChats?.chat || []), newChatMessage]
            }));
        } catch (error) {
            console.log("Something is wrong in your request at : Chats when you're sending message", error);
        }
    }


    return (
        <>
            {/* Content of the chats */}
            <div className='h-screen overflow-auto p-5'>

                <div className="space-y-5">
                    {
                        dynamicChats?.chat?.map((mychat, index) => {
                            const messageFrom = mychat?.from?.toLowerCase();
                            const messageStatus = mychat?.status?.toLowerCase();

                            const isFromMe = messageFrom === "me";
                            return (
                                <div
                                    key={index}
                                    className={`flex w-full ${isFromMe ? "justify-end" : "justify-start"} mb-2`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-lg shadow 
                    ${isFromMe ? "bg-green-100 text-right" : "bg-gray-200 text-left"}`}
                                    >
                                        <p className="text-sm">{mychat?.content}</p>
                                        <div className="text-xs flex items-center gap-1 mt-1 text-gray-600">
                                            {messageStatus === "sent" ? <BiCheckDouble /> : <MdOutlineWatchLater />}
                                            <span>{messageStatus}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {/* Footer for sending Messages from the user's input */}
            <div className="border-t border-gray-200 bg-white shadow-md p-4 sticky bottom-0 w-full">
                <div className="flex items-center justify-between gap-4">
                    {/* Left icons */}
                    <div className="flex items-center gap-4 text-gray-600">
                        <FiPaperclip size={22} className="cursor-pointer" />
                        <MdOutlineEmojiEmotions size={24} className="cursor-pointer" />
                    </div>

                    {/* Message input */}
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    />

                    {/* Send button */}
                    <button
                        onClick={() => {
                            handleUpdatedMessages();
                            setNewMessage("");
                        }}
                        className="ml-2 cursor-pointer disabled:cursor-auto flex items-center justify-center bg-green-500 rounded-full disabled:opacity-90 p-2" disabled={newMessage.trim() === ""}>
                        <RiSendPlaneFill size={20} color='white' />
                    </button>
                </div>
            </div>
        </>
    )
}

export default Chats
