import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const useCreateNewTemplate = () => {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
    const uploadTemplateForApproval = async (templateBody) => {
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/templates`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authInformation?.token,
                },
                body: JSON.stringify(templateBody)
            });
            const result = await apiResponse.json();
            if (apiResponse.status === 201) {
                setSuccessMessage(result?.message);
                setErrorMessage("");
            }
            if (apiResponse.status === 400) {
                setErrorMessage(result?.message);
            }
        } catch (error) {
            setErrorMessage("Error at Uploading Templates ", error?.message);
        }
    }

    return {
        uploadTemplateForApproval, successMessage, errorMessage,
    }
}

export default useCreateNewTemplate