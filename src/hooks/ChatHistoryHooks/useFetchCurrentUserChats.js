import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const useFetchCurrentUserChats = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [currentUserChatHistory, setCurrentUserChatHistory] = useState([]);

    // get the auth information to get the the "token" for authorized user...
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));

    const fetchCurrentUserChats = async () => {
        setIsLoading(true);
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/chats`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token
                }
            });
            const result = await apiResponse.json();
            setCurrentUserChatHistory(result);
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCurrentUserChats();
    }, [])
    return {
        currentUserChatHistory, isLoading, isError
    }
}

export default useFetchCurrentUserChats
