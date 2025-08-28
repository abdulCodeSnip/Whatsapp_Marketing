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
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/contacts`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token
                }
            });

            const result = await apiResponse.json();
            if (apiResponse.ok) {
                dispatch(allContacts(result));
                setFetchContacts(result?.users)
            }
        } catch (error) {
            setIsError(true);
            console.log("Something went wrong at the backend " + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchUsersFromAPI();
    }, [])

    return {
        isLoading, isError, fetchContacts
    }
}

export default useFetchAllContacts
