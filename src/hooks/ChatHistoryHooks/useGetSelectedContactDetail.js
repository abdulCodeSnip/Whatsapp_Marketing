import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const useGetSelectedContactDetail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [selectedContactDetail, setSelectedContactDetail] = useState([]);
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
    const selectedContactToChat = useSelector((state) => state?.selectedContact?.selectedContact);


    // A function that is responsible for fetching the detail of the user, "that is just selected from the sidebar"
    const getUserDetail = async () => {
        setIsLoading(true);
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/${selectedContactToChat?.id}`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token,
                },
            });
            const result = await apiResponse.json();
            if (apiResponse?.ok && apiResponse?.status === 200) {
                setSelectedContactDetail(result);
            }
        } catch (error) {
            console.log("Something is wrong with your request", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }



    return {
        isLoading, isError, getUserDetail, selectedContactDetail
    }
}

export default useGetSelectedContactDetail
