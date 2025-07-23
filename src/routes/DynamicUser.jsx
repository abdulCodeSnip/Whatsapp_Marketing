import React, { useEffect, useState } from 'react'
import SideBar from '../Components/SideBar'
import Header from '../Components/CreateNewTemplatePage/Header'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { CiCircleAlert } from 'react-icons/ci'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { BsCheck } from 'react-icons/bs'
import { CgClose } from 'react-icons/cg'
import { BiCheck } from 'react-icons/bi'

const DynamicUser = () => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [userDetail, setUserDetail] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Values from Redux
    const authInformation = useSelector((state) => state?.auth?.authInformation.at(0));


    const { id } = useParams();

    // Get a dynamic user from the Database using his ID
    const getDynamicUser = async () => {
        try {
            const apiResponse = await fetch(`${authInformation?.baseURL}/users/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token
                },
            });

            const result = await apiResponse.json();
            if (apiResponse.status === 404) {
                setErrorMessage("No User Found with this ID:");
                setUserDetail(null);
            } else {
                setUserDetail(result?.user);
                setErrorMessage(null);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetail((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        getDynamicUser();
    }, []);

    const updateDynamicUser = async () => {
        setIsLoading(true);
        try {
            const apiResponse = await fetch(`${authInformation?.baseURL}/users/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": authInformation?.token,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({ first_name: userDetail?.first_name, last_name: userDetail?.last_name, phone: userDetail?.phone, role: userDetail?.role })
            });

            const result = await apiResponse.json();
            if (apiResponse.status === 200 && apiResponse.ok) {
                setSuccessMessage("User Updated Successfully");
                console.log(result);
            } else {
                console.log("Something is missing");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className='flex overflow-hidden h-screen'>
            <SideBar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />

                {/* Main Content */}
                <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                    <div>
                        {
                            (errorMessage !== null && userDetail === null) && (
                                <div className='text-gray-700 text-2xl font-medium text-center'>
                                    <h2>{errorMessage}</h2>
                                </div>
                            )
                        }
                        {
                            userDetail !== null && (
                                <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-4 gap-x-3'>
                                    <div>
                                        <label htmlFor="first_name" className='text-gray-600 font-medium text-sm block'>
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={userDetail.first_name || ''}
                                            onChange={handleChange}
                                            className='w-full border border-gray-300 rounded-lg p-2 outline-green-500'
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="last_name" className='text-gray-600 font-medium text-sm block'>
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={userDetail.last_name || ''}
                                            onChange={handleChange}
                                            className='w-full border border-gray-300 rounded-lg p-2 outline-green-500'
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className='text-gray-600 font-medium text-sm block'>
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={userDetail.email || ''}
                                            onChange={handleChange}
                                            className='w-full border border-gray-300 rounded-lg p-2 outline-green-500'
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className='text-gray-600 font-medium text-sm block'>
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={userDetail.phone || ''}
                                            onChange={handleChange}
                                            className='w-full border border-gray-300 rounded-lg p-2 outline-green-500'
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="role" className='text-gray-600 font-medium text-sm block'>
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={userDetail.role || ''}
                                            onChange={handleChange}
                                            className='w-full border border-gray-300 rounded-lg p-2 outline-green-500'
                                        />
                                    </div>

                                </div>
                            )
                        }
                    </div>
                    <div>
                        <div className='flex flex-row items-center justify-end gap-x-3'>
                            <button className='cursor-pointer text-sm font-medium px-3 py-2 bg-white hover:bg-gray-50 transition-all text-gray-700 rounded-lg border border-gray-300 shadow-sm'>
                                Cancel
                            </button>
                            <button
                                disabled={isLoading}
                                onClick={() => {
                                    updateDynamicUser();
                                    setTimeout(() => {
                                        setSuccessMessage("");
                                    }, 4000)
                                }} className='cursor-pointer flex flex-row disabled:opacity-90 items-center justify-center gap-x-1 text-sm font-medium px-3 py-2 bg-green-500 text-white rounded-lg border border-gray-300 shadow-sm'>
                                {isLoading && (
                                    <AiOutlineLoading3Quarters className="animate-spin" />)}
                                <span>
                                    Update User
                                </span>
                            </button>
                        </div>
                    </div>
                    {
                        successMessage !== "" && (
                            <div className='flex fixed z-50 right-12 top-12 shadow-sm flex-row items-center bg-green-100 gap-x-3 p-3 rounded-3xl text-green-800'>
                                <div className='flex flex-row items-center justify-center p-[3px] rounded-full border border-green-800'>
                                    <BiCheck size={15} />
                                </div>
                                <span>{successMessage}</span>
                                <button onClick={() => setSuccessMessage("")} className='rounded-full hover:bg-green-100 p-[4px] cursor-pointer'>
                                    <CgClose size={15} />
                                </button>
                            </div>
                        )
                    }
                </main>
            </div>
        </div>
    )
}

export default DynamicUser