import React, { useEffect, useState } from 'react'
import { useAuthenticatedApi } from './useAuthenticatedApi';

const useFetchTemplates = () => {
    const [fetchedTemplates, setFetchedTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");
    const [successMsgOnDelete, setSuccessMsgOnDelete] = useState("");
    const api = useAuthenticatedApi();

    // Fetch All templates from Backend
    const fetchAllTemplates = async () => {
        setIsLoading(true);
        try {
            const result = await api.get('/templates');
            setFetchedTemplates(result);
        } catch (error) {
            setIsError(error?.message);
            console.log("Error at fetching template in \"useFetchTemplates()\" hook ", error);
        } finally {
            setIsLoading(false);
        }
    }

    // Delete a template by ID

    useEffect(() => {
        fetchAllTemplates();
    }, []);

    return {
        isError,
        isLoading,
        fetchedTemplates,
        successMsgOnDelete
    }
}

export default useFetchTemplates