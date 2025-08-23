import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const useFetchTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");
    const [successMsgOnDelete, setSuccessMsgOnDelete] = useState("");
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
    const baseURL = import.meta.env.VITE_API_URL;

    // Fetch All templates from Backend
    const fetchAllTemplates = async () => {
        setIsLoading(true);
        try {
            const apiResponse = await fetch(`${baseURL}/templates`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token
                }
            });
            const result = await apiResponse.json();
            if (apiResponse.ok) {
                setTemplates(result);
            }
        } catch (error) {
            setIsError(error?.message);
            console.log("Error at fetching template in \"useFetchTemplates()\" hook ");
        } finally {
            setIsLoading(false);
        }
    }

    // Delete a template by ID

    useEffect(() => {
        fetchAllTemplates();
    }, [])
    return {
        isError,
        isLoading,
        templates,
        successMsgOnDelete
    }
}

export default useFetchTemplates