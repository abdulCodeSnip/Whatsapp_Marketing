import React, { useEffect, useState } from 'react'
import { useAuthenticatedApi } from './useAuthenticatedApi';

const useFetchTemplates = () => {
    const [fetchedTemplates, setFetchedTemplates] = useState([]);
    const [allTemplates, setAllTemplates] = useState([]); // Store all templates for client-side filtering
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");
    const [successMsgOnDelete, setSuccessMsgOnDelete] = useState("");
    const api = useAuthenticatedApi();

    // Fetch All templates from Backend (no pagination, get all)
    const fetchAllTemplates = async () => {
        setIsLoading(true);
        setIsError("");
        try {
            const result = await api.get('/templates');
            console.log('Templates API Response:', result);
            
            // Handle the API response structure
            if (result && result.success && Array.isArray(result.templates)) {
                setAllTemplates(result.templates);
                setFetchedTemplates(result.templates);
                console.log('Set templates from API response:', result.templates);
            } else if (Array.isArray(result)) {
                // Fallback for old API structure
                setAllTemplates(result);
                setFetchedTemplates(result);
            } else if (result && Array.isArray(result.templates)) {
                setAllTemplates(result.templates);
                setFetchedTemplates(result.templates);
            } else {
                setAllTemplates([]);
                setFetchedTemplates([]);
                console.log('No templates found, setting empty array. Result:', result);
            }
        } catch (error) {
            setIsError(error?.message || "Failed to fetch templates");
            setAllTemplates([]);
            setFetchedTemplates([]);
            console.log("Error at fetching template in \"useFetchTemplates()\" hook ", error);
        } finally {
            setIsLoading(false);
        }
    }

    // Delete a template by ID
    const deleteTemplate = async (templateId) => {
        try {
            setIsLoading(true);
            const result = await api.delete(`/templates/${templateId}`);
            if (result && result.success) {
                setSuccessMsgOnDelete(result.message || "Template deleted successfully");
                // Remove the deleted template from both arrays
                const updatedTemplates = allTemplates.filter(template => template.id !== templateId);
                setAllTemplates(updatedTemplates);
                setFetchedTemplates(updatedTemplates);
                return true;
            }
            return false;
        } catch (error) {
            setIsError(error?.message || "Failed to delete template");
            console.error("Error deleting template:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchAllTemplates();
    }, []);

    return {
        isError,
        isLoading,
        fetchedTemplates,
        allTemplates,
        successMsgOnDelete,
        fetchAllTemplates,
        deleteTemplate,
        refetch: fetchAllTemplates
    }
}

export default useFetchTemplates