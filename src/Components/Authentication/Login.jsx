import React, { useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";
import { GiSemiClosedEye } from "react-icons/gi";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Cookies from "js-cookie";
import { redirect, useNavigate } from "react-router-dom";

const AuthForm = () => {

    const baseURL = "http://whatsapp-app-api.servicsters.com/";
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successOrErr, setSuccessOrErr] = useState("");
    const navigate = useNavigate();

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
            const apiResponse = await fetch(`${baseURL}/auth/register`, {
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
                Cookies.set("jwtToken", result?.token);
                Cookies.set("password", result?.password);
                setIsLogin(true);
            }

        } catch (error) {
            console.log("Error: ", error.message);
        } finally {
            setIsLoading(false);
        }
    }

    // Login User
    const loginUser = async () => {
        setIsLoading(true)
        try {
            const apiResponse = await fetch(`${baseURL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: userFormData?.email, password: userFormData?.password })
            });

            const result = await apiResponse.json();
            console.log(result);
            if (apiResponse.status === 401) {
                setSuccessOrErr("Please Enter right credintials");
            }
            if (result?.message?.includes("Login")) {
                Cookies.set("jwtToken", result?.token);
                Cookies.set("password", userFormData.password);
                Cookies.set("email", result?.user?.email);
                redirect("/");
                navigate("/");
            }
            if (apiResponse.ok) {
                setSuccessOrErr("Login Successfully");
                console.log(result?.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        if (successOrErr.includes("login Successfully")) {
            redirect("/");
        } else {
            redirect("/login");
        }
    }, [successOrErr])
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-green-700">
                    {isLogin ? "Login to Your Account" : "Create an Account"}
                </h2>

                <form className="space-y-4">
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
                            successOrErr && isLogin && (
                                <span className={`text-xs ${successOrErr.includes("Login Successfully") ? "text-green-600" : "text-red-600"}`}>{successOrErr}</span>
                            )
                        }
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            isLogin ? loginUser() : registerNewUser();
                        }}
                        className="w-full bg-green-600 disabled:opacity-80 font-medium text-sm text-white py-2 rounded-lg hover:bg-green-700 cursor-pointer transition-all"
                    >
                        {isLogin ? "Login" : "Register"}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        className="text-indigo-600 hover:underline font-medium"
                        onClick={toggleForm}
                    >
                        {isLogin ? "Register here" : "Login here"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
