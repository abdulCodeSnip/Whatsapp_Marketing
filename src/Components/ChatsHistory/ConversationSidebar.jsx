import React, { useEffect, useState } from 'react'
import { BiDotsVertical, BiSearch } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { changeSelectedContact } from '../../redux/chatHistoryPage/selectedContactConversation';
import { dynamicChats } from '../../redux/chatHistoryPage/chats';

const ConversationSidebar = () => {
    const [conversation, setConversation] = useState([]);

    //values from Redux
    const authInformation = useSelector((state) => state?.auth?.authInformation.at(0));
    const conversationFromStore = useSelector((state) => state?.selectedContact?.selectedContact);

    const dispatch = useDispatch();

    const fetchAllMessages = async () => {
        try {
            const apiResponse = await fetch(`${authInformation?.baseURL}/messages/history/12`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token
                }
            });

            const result = await apiResponse.json();
            if (apiResponse.ok && apiResponse.status === 200) {
                setConversation(result);
                console.log(result);
            } else {
                console.log("You're missing something");
            }
        } catch (error) {
            console.log("Something is wrong !", error);
        }
    }

    useEffect(() => {
        fetchAllMessages();
    }, []);
    return (
        <div className='w-[300px] shadow-xl bg-white p-4 border border-gray-200 h-[100%] flex flex-col overflow-hidden space-y-3'>
            <div className='flex flex-row items-center justify-between'>
                <div>
                    <h2 className='text-gray-900 font-medium text-lg'>Chat History</h2>
                </div>
                <div>
                    <BiDotsVertical size={17} color='gray' />
                </div>
            </div>
            <div className='relative'>
                <input type="text" placeholder='Search Conversations' className='rounded-lg border text-sm px-3 py-2 pl-8 border-gray-300 outline-green-500 w-full' />
                <div className='absolute top-3 left-2 text-gray-500'>
                    <BiSearch />
                </div>
            </div>

            <h2 className='text-gray-900 font-medium text-sm my-2'>Recent Conversations</h2>
            <div className='divide-y divide-gray-200 flex flex-col'>
                <div onClick={() => {
                    dispatch(changeSelectedContact(conversation?.receiver));
                    dispatch(dynamicChats(conversation?.chat));
                }} className={`flex flex-row items-center cursor-pointer p-2 ${conversationFromStore?.id === conversation?.receiver?.id ? "bg-green-50 border-l-3 gap-x-2 border-green-600" : "bg-gray-50"}`}>

                    {/* Logo of the user */}
                    <div>
                        <h2 className='text-purple-700 bg-purple-100 rounded-full w-[40px] h-[40px] flex items-center justify-center font-medium'>
                            {
                                conversation?.receiver?.name.charAt(0).toUpperCase() + " " + conversation?.receiver?.name?.charAt(conversation?.receiver?.name?.length - 1).toUpperCase()
                            }
                        </h2>


                    </div>

                    <div className='flex flex-col'>
                        <div className='flex flex-row items-center justify-between w-full'>
                            {/* Contact Name */}
                            <h2 className='text-gray-900 font-medium '>
                                {conversation?.receiver?.name}
                            </h2>
                            {/* Extracting Timestamp of the message that was just updated */}
                            <span className='text-gray-500 text-xs'>{(conversation?.chat?.at(conversation?.chat?.length - 1).updated_at)?.split("T")?.at(1)?.split(".")?.at(0)?.slice(0, 5)}</span>
                        </div>
                        {/* Recent Message Overview */}
                        <span className='text-gray-500 text-xs'>
                            {
                                conversation?.chat?.at(conversation?.chat?.length - 1)?.content?.slice(0, 50) + "...."
                            }
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConversationSidebar