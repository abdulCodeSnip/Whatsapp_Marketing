import React, { useEffect, useState } from 'react'
import { BiDotsVertical, BiSearch } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { changeSelectedContact } from '../../redux/chatHistoryPage/selectedContactConversation';
import { dynamicChats, fetchAllChats } from '../../redux/chatHistoryPage/chats';

const ConversationSidebar = () => {
    console.log(useSelector((state) => state?.dynamicChats));

    //values from Redux
    const authInformation = useSelector((state) => state?.auth?.authInformation.at(0));
    const currentUserToConversate = useSelector((state) => state?.selectedContact?.selectedContact);
    const dispatch = useDispatch();


    const getCurrenUserInformation = async () => {
        try {

        } catch (error) {

        }
    }

    // OPtions for user to his username, and his avatar,
    const userChatSideBarUIOPtions = {
        username: currentUserToConversate?.first_name?.charAt(0)?.toUpperCase() +
            currentUserToConversate?.first_name?.slice(1) + " " + currentUserToConversate?.last_name?.charAt(0)?.toUpperCase() +
            currentUserToConversate?.last_name?.slice(1),
        avartarText: currentUserToConversate?.first_name?.charAt(0)?.toUpperCase() +
            currentUserToConversate?.last_name?.charAt(0)?.toUpperCase(),
    }

    const getChatHistoryOfCurrenUser = async () => {
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/messages/history/${currentUserToConversate?.id}`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token,
                }
            });

            const apiResult = await apiResponse.json();
            dispatch(fetchAllChats(apiResult));
        } catch (error) {
            console.log("Something is wrong with your request at : ConversationSidebar for fetching chat history....", error)
        }
    }

    useEffect(() => {
        getChatHistoryOfCurrenUser();
    }, [])

    return (
        <div className="w-xs h-[100%] bg-white p-2 border-r-1 shadow-xl flex flex-col border-r-gray-200">
            <div>
                {/* Normal Heading */}
                <div className='text-gray-900 font-medium text-lg flex flex-col space-y-3'>
                    <h2>Chats</h2>
                    <span className='text-sm font-normal text-gray-500'>Send and recieve messages from your contacts</span>
                </div>
            </div>
            <div className='flex flex-col divide-y divide-gray-300 items-start'>
                <button className='w-full bg-gray-50 items-center flex px-3 py-2'>
                    {/* Avatar */}
                    <div className='flex gap-x-2'>
                        <span className='w-8 h-8 font-medium text-sm text-white bg-purple-500 flex items-center justify-center rounded-full p-2'>{userChatSideBarUIOPtions.avartarText}</span>
                        <span className='text-sm font-medium text-gray-800'>{userChatSideBarUIOPtions?.username}</span>
                    </div>
                    <div>

                    </div>
                </button>
            </div>
        </div>
    )
}

export default ConversationSidebar