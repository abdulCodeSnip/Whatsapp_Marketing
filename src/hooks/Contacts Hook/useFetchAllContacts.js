import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { allContacts } from '../../redux/contactsPage/contactsFromAPI';

const useFetchAllContacts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [fetchContacts, setFetchContacts] = useState([]);
    const dispatch = useDispatch();
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));

    // This function will give us all the contacts from api, and return them, so we can use it whereve we want
    const fetchUsersFromAPI = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/contacts`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token
                }
            });

            const result = await apiResponse.json();
            if (apiResponse.ok) {
                console.log('Contacts API Response:', result);
                dispatch(allContacts(result));
                
                // Handle different possible API response structures
                if (Array.isArray(result)) {
                    setFetchContacts(result);
                    console.log('Set contacts from direct array:', result);
                } else if (result && Array.isArray(result.users)) {
                    setFetchContacts(result.users);
                    console.log('Set contacts from result.users:', result.users);
                } else if (result && Array.isArray(result.data)) {
                    setFetchContacts(result.data);
                    console.log('Set contacts from result.data:', result.data);
                } else {
                    setFetchContacts([]);
                    console.log('No contacts found, setting empty array. Result:', result);
                }
            } else {
                setIsError(true);
                console.log("API Error: " + (result.message || "Failed to fetch contacts"));
            }
        } catch (error) {
            setIsError(true);
            console.log("Something went wrong at the backend " + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    // Refresh function to refetch contacts
    const refreshContacts = async () => {
        await fetchUsersFromAPI();
    }

    useEffect(() => {
        fetchUsersFromAPI();
    }, [])

    return {
        isLoading, isError, fetchContacts, refreshContacts
    }
}

export default useFetchAllContacts
