import React, { useEffect, useState } from 'react'
import SideBar from '../Components/SideBar'
import Header from '../Components/CreateNewTemplatePage/Header'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { CiCircleAlert } from 'react-icons/ci'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { BsCheck } from 'react-icons/bs'
import { CgClose } from 'react-icons/cg'
import { BiCheck } from 'react-icons/bi'
import Spinner from '../Components/Spinner'

const DynamicUser = () => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [userDetail, setUserDetail] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Start with true for initial load
    const [isUpdating, setIsUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [hasChanges, setHasChanges] = useState(false);
    const [originalUserDetail, setOriginalUserDetail] = useState(null);

    // Values from Redux
    const authInformation = useSelector((state) => state?.auth?.authInformation.at(0));

    const { id } = useParams();
    const navigate = useNavigate();

    let url = import.meta.env?.VITE_API_URL;

    // Get a dynamic user from the Database using his ID
    const getDynamicUser = async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const apiResponse = await fetch(`${import.meta.env?.VITE_API_URL}/users/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token
                },
            });

            const result = await apiResponse.json();
            if (apiResponse.status === 404) {
                setErrorMessage("No User Found with this ID");
                setUserDetail(null);
            } else if (apiResponse.ok) {
                setUserDetail(result?.user);
                setOriginalUserDetail(result?.user); // Store original for comparison
                setErrorMessage(null);
            } else {
                setErrorMessage("Failed to load user details");
                setUserDetail(null);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("Network error. Please check your connection.");
            setUserDetail(null);
        } finally {
            setIsLoading(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetail((prev) => {
            const updated = {
                ...prev,
                [name]: value,
            };
            
            // Check if there are changes from original
            const hasModifications = originalUserDetail && (
                updated.first_name !== originalUserDetail.first_name ||
                updated.last_name !== originalUserDetail.last_name ||
                updated.phone !== originalUserDetail.phone ||
                updated.role !== originalUserDetail.role
            );
            
            setHasChanges(hasModifications);
            return updated;
        });
    };

    // Handle cancel with navigation
    const handleCancel = () => {
        if (hasChanges) {
            const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
            if (!confirmLeave) return;
        }
        navigate(-1); // Navigate back to previous page
    };

    useEffect(() => {
        if (authInformation?.token) {
            getDynamicUser();
        }
    }, [id, authInformation?.token]);

    // Update a user based on his ID
    const updateDynamicUser = async () => {
        if (!hasChanges) {
            setSuccessMessage("No changes to save");
            setTimeout(() => setSuccessMessage(""), 3000);
            return;
        }

        setIsUpdating(true);
        try {
            const apiResponse = await fetch(`${import.meta?.env?.VITE_API_URL}/users/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": authInformation?.token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    first_name: userDetail?.first_name, 
                    last_name: userDetail?.last_name, 
                    phone: userDetail?.phone, 
                    role: userDetail?.role 
                })
            });

            const result = await apiResponse.json();
            if (apiResponse.status === 200 && apiResponse.ok) {
                setSuccessMessage("Contact updated successfully!");
                setOriginalUserDetail(userDetail); // Update original to current
                setHasChanges(false); // Reset changes flag
                console.log(result);
            } else {
                setErrorMessage("Failed to update contact. Please try again.");
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("Network error. Please check your connection.");
        } finally {
            setIsUpdating(false);
            // Auto-hide success message
            setTimeout(() => {
                setSuccessMessage("");
            }, 4000);
        }
    }

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="animate-pulse space-y-6">
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-4 gap-x-3">
                {[...Array(4)].map((_, index) => (
                    <div key={index}>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end space-x-3">
                <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
            </div>
        </div>
    );

    // Error state component
    const ErrorState = () => (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 mb-4">
                <CiCircleAlert size={64} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load contact</h3>
            <p className="text-gray-500 text-center mb-4">
                {errorMessage || "There was an error loading the contact details."}
            </p>
            <div className="flex space-x-3">
                <button
                    onClick={getDynamicUser}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                    Try Again
                </button>
                <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    Go Back
                </button>
            </div>
        </div>
    );

    return (
        <div className='flex overflow-hidden h-screen'>
            <SideBar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />

                {/* Main Content */}
                <main className="flex-1 p-6 bg-gray-50 overflow-y-auto space-y-5">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Title */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Edit Contact</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Update contact information and save changes
                            </p>
                        </div>

                        {isLoading ? (
                            <LoadingSkeleton />
                        ) : errorMessage && !userDetail ? (
                            <ErrorState />
                        ) : userDetail ? (
                            <>
                                {/* Form Fields */}
                                <div className='bg-white rounded-lg shadow-sm p-6'>
                                    <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-4 gap-x-3'>
                                        <div>
                                            <label htmlFor="first_name" className='text-gray-600 font-medium text-sm block mb-2'>
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={userDetail.first_name || ''}
                                                onChange={handleChange}
                                                disabled={isUpdating}
                                                className='w-full border border-gray-300 rounded-lg p-2 outline-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-200 transition-all'
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="last_name" className='text-gray-600 font-medium text-sm block mb-2'>
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={userDetail.last_name || ''}
                                                onChange={handleChange}
                                                disabled={isUpdating}
                                                className='w-full border border-gray-300 rounded-lg p-2 outline-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-200 transition-all'
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className='text-gray-600 font-medium text-sm block mb-2'>
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={userDetail.email || ''}
                                                onChange={handleChange}
                                                disabled={isUpdating}
                                                className='w-full border border-gray-300 rounded-lg p-2 outline-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-200 transition-all'
                                                readOnly // Email typically shouldn't be editable
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className='text-gray-600 font-medium text-sm block mb-2'>
                                                Phone *
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={userDetail.phone || ''}
                                                onChange={handleChange}
                                                disabled={isUpdating}
                                                className='w-full border border-gray-300 rounded-lg p-2 outline-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-200 transition-all'
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Changes indicator */}
                                    {hasChanges && (
                                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="text-amber-600 mr-2">
                                                    <CiCircleAlert size={20} />
                                                </div>
                                                <p className="text-sm text-amber-700">
                                                    You have unsaved changes
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className='bg-white rounded-lg shadow-sm p-6'>
                                    <div className='flex flex-row items-center justify-end gap-x-3'>
                                        <button 
                                            onClick={handleCancel}
                                            disabled={isUpdating}
                                            className='cursor-pointer text-sm font-medium px-4 py-2 bg-white hover:bg-gray-50 transition-all text-gray-700 rounded-lg border border-gray-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            disabled={isUpdating || !hasChanges}
                                            onClick={updateDynamicUser}
                                            className={`cursor-pointer flex flex-row items-center justify-center gap-x-2 text-sm font-medium px-4 py-2 rounded-lg border shadow-sm transition-all ${
                                                hasChanges 
                                                    ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' 
                                                    : 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                                            } disabled:opacity-50`}
                                        >
                                            {isUpdating && (
                                                <Spinner size="small" />
                                            )}
                                            <span>
                                                {isUpdating ? 'Updating...' : 'Update Contact'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className='flex fixed z-50 right-12 top-12 shadow-lg flex-row items-center bg-green-100 gap-x-3 p-4 rounded-lg text-green-800 border border-green-200'>
                            <div className='flex flex-row items-center justify-center p-1 rounded-full border border-green-600'>
                                <BiCheck size={16} />
                            </div>
                            <span className="font-medium">{successMessage}</span>
                            <button 
                                onClick={() => setSuccessMessage("")} 
                                className='rounded-full hover:bg-green-200 p-1 cursor-pointer transition-colors'
                            >
                                <CgClose size={16} />
                            </button>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && userDetail && (
                        <div className='flex fixed z-50 right-12 top-12 shadow-lg flex-row items-center bg-red-100 gap-x-3 p-4 rounded-lg text-red-800 border border-red-200'>
                            <div className='flex flex-row items-center justify-center p-1 rounded-full border border-red-600'>
                                <CiCircleAlert size={16} />
                            </div>
                            <span className="font-medium">{errorMessage}</span>
                            <button 
                                onClick={() => setErrorMessage(null)} 
                                className='rounded-full hover:bg-red-200 p-1 cursor-pointer transition-colors'
                            >
                                <CgClose size={16} />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default DynamicUser