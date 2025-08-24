import React, { useEffect, useState } from 'react'
import { BiDotsVertical, BiSearch } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { changeSelectedContact } from '../../redux/chatHistoryPage/selectedContactConversation';
import { dynamicChats, fetchAllChats } from '../../redux/chatHistoryPage/chats';
import useFetchCurrentUserChats from '../../hooks/ChatHistoryHooks/useFetchCurrentUserChats';
import Spinner from "../../Components/Spinner";

const ConversationSidebar = () => {

    //values from Redux
    const authInformation = useSelector((state) => state?.auth?.authInformation.at(0));
    const currentUserToConversate = useSelector((state) => state?.selectedContact?.selectedContact);
    const dispatch = useDispatch();

    // History of the user if messages are sent
    const getChatHistoryOfCurrenUser = async () => {
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/messages/history/${currentUserToConversate?.id}`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token,
                }
            });

            const apiResult = await apiResponse.json();
            if (apiResponse.ok) {
                dispatch(fetchAllChats(apiResult));
            }
        } catch (error) {
            console.log("Something is wrong with your request at : ConversationSidebar for fetching chat history....", error)
        }
    }

    useEffect(() => {
        getChatHistoryOfCurrenUser();
    }, [currentUserToConversate]);

    const { isError, isLoading, currentUserChatHistory } = useFetchCurrentUserChats();
    
    if (isLoading) return (
        <Spinner />
    )
    
    return (
        <div className="w-80 h-full bg-white p-2 border-r shadow-xl flex flex-col border-r-gray-200">
            {/* Fixed Header Section */}
            <div className="flex-shrink-0">
                <div className='text-gray-900 font-medium text-lg flex flex-col space-y-3'>
                    <h2>Chats</h2>
                    <span className='text-sm font-normal text-gray-500'>Send and receive messages from your contacts</span>
                </div>
            </div>

            {/* Scrollable Content Section */}
            <div className='flex flex-col items-start flex-1 min-h-0'>
                <div className='overflow-y-auto gap-2 w-full my-5 flex-1'>
                    {
                        currentUserChatHistory?.contacts?.map((contact, index) => {

                            // Get the username of user to show as profile
                            const username = contact?.first_name?.charAt(0)?.toUpperCase() +
                                contact?.first_name?.slice(1) + " " + contact?.last_name?.charAt(0)?.toUpperCase() +
                                contact?.last_name?.slice(1);

                            // Make the avatar from the "First Letter of First Name", "First Letter of Last Name"
                            const avatarText = contact?.first_name?.charAt(0)?.toUpperCase() +
                                contact?.last_name?.charAt(0)?.toUpperCase();

                            return (
                                <div onClick={() => dispatch(changeSelectedContact(contact))} key={contact?.id || index} className='flex w-full hover:bg-gray-100 rounded-lg mb-2'>
                                    <div className={`flex flex-row ${currentUserToConversate?.id === contact?.id ? "bg-gray-100 border-l-[4px] rounded-l-none border-l-green-500" : "bg-white"} items-center justify-start w-full gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded-lg`}>
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                            <span>{avatarText}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">{username}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default ConversationSidebar