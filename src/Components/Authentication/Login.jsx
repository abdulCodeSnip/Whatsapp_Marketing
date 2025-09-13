import React, { useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";
import { GiSemiClosedEye } from "react-icons/gi";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { redirect, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authUtils } from "../../utils/auth";

const AuthForm = () => {

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successOrErr, setSuccessOrErr] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [userFormData, setUserFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "",
        password: "",
    })

    const toggleForm = () => setIsLogin(!isLogin);

    // Register User
    const registerNewUser = async () => {
        setIsLoading(true);
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    first_name: userFormData.first_name,
                    last_name: userFormData?.last_name,
                    email: userFormData?.email,
                    phone: userFormData.phone,
                    password: userFormData?.password,
                    role: userFormData?.role || "user",
                })
            });

            const result = await apiResponse.json();
            console.log(result?.message);
            if (apiResponse.ok) {
                console.log(result);
                authUtils.setAuthData(
                    result?.token, 
                    result?.user?.email || userFormData.email, 
                    userFormData.password,
                    dispatch
                );
                
                setSuccessOrErr("Registration successful! Redirecting...");
                // Navigate after successful registration
                setTimeout(() => {
                    navigate("/", { replace: true });
                }, 1000);
            }

        } catch (error) {
            console.log("Error: ", error.message);
        } finally {
            setIsLoading(false);
        }
    }

    // Login User
    const loginUser = async () => {
        setIsLoading(true);
        setSuccessOrErr(""); // Clear previous errors
        
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
                setSuccessOrErr("Please Enter right credentials");
                return; // Stop execution here
            }
            
            if (apiResponse.ok && result?.token) {
                authUtils.setAuthData(
                    result?.token, 
                    result?.user?.email, 
                    userFormData.password,
                    dispatch
                );

                setSuccessOrErr("Login Successfully! Redirecting...");
                
                // Navigate after successful login with a small delay
                setTimeout(() => {
                    navigate("/", { replace: true });
                }, 1000);
            } else {
                setSuccessOrErr("Login failed. Please try again.");
            }
        } catch (error) {
            console.log(error.message);
            setSuccessOrErr("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-green-700">
                    {isLogin ? "Login to Your Account" : "Create an Account"}
                </h2>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    {!isLogin && (
                        <>
                            <div>
                                <label
                                    htmlFor="first_name"
                                    className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="first_name"
                                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="John"
                                    value={userFormData.first_name}
                                    onChange={(e) => setUserFormData({ ...userFormData, first_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="last_name"
                                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Doe"
                                    value={userFormData?.last_name}
                                    onChange={(e) => setUserFormData({ ...userFormData, last_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="phone_number"
                                    className="block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    id="phone_number"
                                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="+92 3129229373"
                                    value={userFormData.phone}
                                    onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="example@example.com"
                            value={userFormData.email}
                            onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="••••••••"
                            value={userFormData.password}
                            onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                        />
                        <button className="px-3 py-2 absolute right-1.5 bottom-1.5 cursor-pointer" type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <IoEyeOff /> : <IoEye />}
                        </button>
                        {
                            successOrErr && (
                                <span className={`text-xs ${successOrErr.includes("Successfully") || successOrErr.includes("successful") ? "text-green-600" : "text-red-600"}`}>
                                    {successOrErr}
                                </span>
                            )
                        }
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            isLogin ? loginUser() : registerNewUser();
                        }}
                        disabled={isLoading}
                        className="w-full bg-green-600 disabled:opacity-50 font-medium text-sm text-white py-2 rounded-lg hover:bg-green-700 cursor-pointer transition-all"
                    >
                        {isLoading ? (isLogin ? "Logging in..." : "Registering...") : (isLogin ? "Login" : "Register")}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        className="text-indigo-600 hover:underline font-medium"
                        onClick={toggleForm}
                        disabled={isLoading}
                    >
                        {isLogin ? "Register here" : "Login here"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;