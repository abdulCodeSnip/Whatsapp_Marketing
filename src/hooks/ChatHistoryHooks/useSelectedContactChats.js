import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllChats } from '../../redux/chatHistoryPage/chats';

const useSelectedContactChats = () => {

    const currentUserToConversate = useSelector((state) => state?.selectedContact?.selectedContact);
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
    const dispatch = useDispatch();

    // History of the user if messages are sent
    const getChatHistoryOfCurrenUser = async () => {
        // Add null check here
        if (!currentUserToConversate?.id) {
            return;
        }

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
}

export default useSelectedContactChats
