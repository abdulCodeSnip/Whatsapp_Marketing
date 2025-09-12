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
            console.log('Templates API Response:', result);
            
            // Handle different possible API response structures
            if (Array.isArray(result)) {
                setFetchedTemplates(result);
                console.log('Set templates from direct array:', result);
            } else if (result && Array.isArray(result.templates)) {
                setFetchedTemplates(result.templates);
                console.log('Set templates from result.templates:', result.templates);
            } else if (result && Array.isArray(result.data)) {
                setFetchedTemplates(result.data);
                console.log('Set templates from result.data:', result.data);
            } else {
                setFetchedTemplates([]);
                console.log('No templates found, setting empty array. Result:', result);
            }
        } catch (error) {
            setIsError(error?.message);
            setFetchedTemplates([]);
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