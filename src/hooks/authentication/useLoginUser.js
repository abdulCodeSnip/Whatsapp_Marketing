import React, { useState } from 'react'
import Cookies from "js-cookie"

const useLoginUser = () => {
    const [successOrErr, setSuccessOrErr] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [userFormData, setUserFormData] = useState({})

    const loginUser = async () => {
        setIsLoading(true)
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: userFormData?.email, password: userFormData?.password })
            });

            const result = await apiResponse.json();
            if (apiResponse.status === 401) {
                setSuccessOrErr("Please Enter right credintials");
            }
            if (result?.message?.trim()?.includes("Login")) {
                Cookies.set("jwtToken", "");
                Cookies.set("jwtToken", result?.token);
                Cookies.set("password", userFormData.password);
                Cookies.set("email", result?.user?.email);
                navigate("/");
            }
            if (apiResponse.ok) {
                setSuccessOrErr("Login Successfully");
                console.log(result?.message);
                navigate("/")
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    return {

    }
}

export default useLoginUser
