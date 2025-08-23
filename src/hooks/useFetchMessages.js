import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const useFetchMessages = (userID) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const authInformation = useSelector((state) => state?.auth?.authInformation.at(0));


    // Fetch messages based on the userID
    const fetchAllMessages = async () => {
        setIsLoading(true);
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/messages/history/${userID}`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token
                }
            });
            const result = await apiResponse.json();
            if (apiResponse.ok) {
                setMessages([result]);
            }
        } catch (error) {
            console.log(error?.message);
            setIsError(error?.message);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchCurrentUser = async () => {
        setIsLoading(true);
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/${userID}`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token
                }
            });
            const result = await apiResponse.json();
            if (apiResponse.ok) {
                setCurrentUser(result);
            }
        } catch (error) {
            console.log(error, "Error at fetching single user in \"useFetchMessage\"");
        } finally {
            setIsLoading(false);
        }
    }

    // Fetch Messages and a user with Chats, when the component mounts
    useEffect(() => {
        fetchAllMessages();
        fetchCurrentUser();
    }, [])
    return {
        isLoading, isError, messages, currentUser
    }
}

export default useFetchMessages;