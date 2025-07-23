import React, { useEffect } from 'react'
import { FaCheck, FaHistory } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux'
import { dynamicChats } from '../../redux/chatHistoryPage/chats';

const Chats = () => {

    const chats = useSelector((state) => state?.dynamicChats?.chats);
    const newMessage = useSelector((state) => state?.dynamicChats?.messageText);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(dynamicChats(chats));
    }, [newMessage])

    return (
        <>
            <div className='h-screen overflow-auto p-5'>
                <div className="space-y-5">
                    {chats?.map((chat, index) => {
                        const chatTime = chat?.updated_at?.split("T")?.at(1)?.split(".")?.at(0)?.slice(0, 5);
                        const chatContent = chat?.content;
                        const messageFrom = chat?.from?.toLowerCase();
                        const isMessageScheduled = chat?.scheduled_at;
                        const status = chat?.status?.toLowerCase();
                        const isAdmin = messageFrom === "me";

                        return (
                            <div key={index} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`px-4 py-2 max-w-xs rounded-lg shadow-md ${isAdmin ? "bg-green-100 text-gray-900" : "bg-white text-gray-800"
                                        }`}
                                >
                                    <p className="text-sm break-words">{chatContent}</p>
                                    <div className="flex items-center justify-end space-x-1 mt-1 text-gray-500 text-[10px]">
                                        <span>{chatTime}</span>
                                        {status === "sent" ? <FaCheck size={8} color='skyblue' /> : <MdAccessTime size={10} color='gray' />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    )
}

export default Chats
