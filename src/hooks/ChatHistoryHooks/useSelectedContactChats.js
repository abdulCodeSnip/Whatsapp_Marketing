import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllChats } from '../../redux/chatHistoryPage/chats';

const useSelectedContactChats = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);

    const currentUserToConversate = useSelector((state) => state?.selectedContact?.selectedContact);
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
    const dispatch = useDispatch();

    // History of the user if messages are sent
    const getChatHistoryOfCurrenUser = async () => {
        // Add null check here
        if (!currentUserToConversate?.id) {
            return;
        }

        setIsLoading(true);
        setIsError(null);
        
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
            } else {
                setIsError(apiResult.message || "Failed to fetch chat history");
            }
        } catch (error) {
            console.log("Something is wrong with your request at : ConversationSidebar for fetching chat history....", error);
            setIsError(error.message || "Network error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getChatHistoryOfCurrenUser();
    }, [currentUserToConversate]);

    return { isLoading, isError, refetch: getChatHistoryOfCurrenUser };
}

export default useSelectedContactChats
