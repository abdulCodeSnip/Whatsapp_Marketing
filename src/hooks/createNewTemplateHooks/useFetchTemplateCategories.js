import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const useFetchTemplateCategories = () => {
    const [isError, setIsError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
    const baseURL = import.meta.env.VITE_API_URL;

    // Function or "custom hook" to fetch all the categories of templates, "So we can use it with templates"
    const fetchAllTemplateCategories = async () => {
        setIsLoading(true);
        try {
            const apiResponse = await fetch(`${baseURL}/categories`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token
                }
            });
            const result = await apiResponse.json();
            if (apiResponse.ok) {
                setCategories(result);
            }
        } catch (error) {
            setIsError("Error at fetching Categories Hook", error?.message);
        } finally {
            setIsLoading(false);
        }
    }

    // when this hook is called the function will immediately called out and categories would be returned
    useEffect(() => {
        fetchAllTemplateCategories();
    }, []);
    return {
        isLoading, isError, categories
    }
}

export default useFetchTemplateCategories