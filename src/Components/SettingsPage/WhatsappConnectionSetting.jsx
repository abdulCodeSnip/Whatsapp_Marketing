import React, { useEffect, useState } from 'react'
import { BiCheckCircle } from 'react-icons/bi'
import { FaCheckCircle } from 'react-icons/fa'
import { MdArrowRightAlt } from 'react-icons/md'
import { RiWhatsappFill } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import useFetchTemplates from '../../hooks/useFetchTemplates'
import Spinner from '../Spinner'


const WhatsappConnectionSetting = () => {

    const currentUser = useSelector((state) => state?.loginUser?.userLogin);
    const allTemplates = useSelector((state) => state?.allTemplates?.allTemplates);
    const { templates, isError, isLoading } = useFetchTemplates();
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));

    const [apiConfiguration, setApiConfiguration] = useState([]);
    const [showAPIKey, setShowAPIKey] = useState(false);

    const getWhatsappAPIConfiguration = async () => {
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/whatsapp/config?userId=13`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token
                }
            });
            const result = await apiResponse.json();
            setApiConfiguration(result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getWhatsappAPIConfiguration();
    }, [])

    // Loading spinner if the component is loading data from the server
    if (isLoading) return <Spinner />
    return (
        <div className='w-full h-[100%] overflow-y-auto rounded-xl divide-y divide-gray-200 bg-white shadow-sm'>
            <div className='p-6'>
                <div className='space-y-1'>
                    <h2 className='text-gray-800 font-medium text-lg'>WhatsApp Connection</h2>
                    <span className='text-gray-500 text-sm'>Configure your WhatsApp Business API connection</span>
                </div>
            </div>
            <div className='p-6 space-y-4'>
                <div className='bg-green-100 p-3 rounded-lg border border-green-300'>
                    <div className='flex flex-row gap-x-4 items-center'>
                        <FaCheckCircle size={15} color='green' />
                        <div>
                            <h2 className='text-green-700 font-medium text-sm'>WhatsApp Connected</h2>
                            <span className='text-green-500 text-sm'>Your WhatsApp Business account is successfully connected and active.</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className='space-y-3'>
                        <h2 className='text-gray-800 font-medium text-md'>
                            Connected Number
                        </h2>

                        {/* Card for current phone number */}
                        <div className='p-4 rounded-xl border border-gray-300 bg-gray-50 flex flex-row justify-between items-center'>
                            <div className='flex flex-row items-start gap-3'>
                                <div className='bg-green-100 p-2 rounded-full text-green-700 '>
                                    <RiWhatsappFill size={20} />
                                </div>
                                <div className='flex flex-col'>
                                    <h2 className='text-gray-800 font-medium text-sm'>{currentUser?.phone || "+92 3129229373"}</h2>
                                    <span className='text-gray-500 text-xs'>{currentUser?.role?.charAt(0).toUpperCase() + currentUser?.role?.slice(1) || "Role"}</span>
                                </div>
                            </div>
                            <div>
                                <button disabled className='border-2 disabled:cursor-not-allowed border-gray-200  bg-white hover:bg-gray-50 px-3 py-3 font-medium text-xs rounded-lg text-gray-600'>Change Number</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The API Configuration, of current user, this will only show to admin only.... */}
            <div className='p-6 space-y-4'>
                <div className='space-y-2'>
                    <h2 className='text-gray-800 font-medium text-md'>API Configuration</h2>
                    <div className='space-y-2 '>
                        <label htmlFor="apiKey" className='text-gray-600 font-medium text-sm block'>API Key</label>
                        <div className='flex flex-row gap-x-2'>
                            <input type={showAPIKey ? "text" : "password"} name="apiKey" id="apiKey" contentEditable={false} readOnly value={apiConfiguration?.whatsapp_api_token} className='border border-gray-200 rounded-xl outline-green-500 w-full px-3 py-2' />
                            <button onClick={() => setShowAPIKey(!showAPIKey)} className='bg-gray-200 rounded-lg border-2 border-gray-200 w-[100px] cursor-pointer text-gray-800 font-medium text-xs'>Show</button>
                        </div>
                    </div>
                </div>

                <div>
                    <div>
                        <h2 className='font-medium text-gray-800 text-base'>Message Templates</h2>
                        <span className='text-gray-500 text-sm'>Approved, and Pending WhatsApp message templates for your business account</span>
                    </div>

                    {/* Templates table, that will showcase the templates existing.... */}
                    <div className='w-full rounded-lg border border-gray-300 divide-y divide-gray-200'>
                        {
                            templates?.templates?.slice(0, 3)?.map((template, index) => (
                                <div key={index} className='flex flex-row items-center justify-between px-3 py-2'>
                                    <div className='flex flex-col'>
                                        <h2 className='text-gray-800 font-medium text-sm'>{template?.name}</h2>
                                        <span className='text-gray-500 text-xs'>{template?.category?.name}</span>
                                    </div>
                                    <div className={`${template?.status?.toLowerCase() === "pending" ? "bg-yellow-100" : template?.status?.toLowerCase() === "active" || template?.status?.toLowerCase() === "approved" ? "bg-green-100" : "bg-red-100"} px-2 py-1 rounded-full text-xs`}>
                                        <span className={`${template?.status?.toLowerCase() === "active" || template?.status?.toLowerCase() === "approved" ? "text-green-700" : template?.status?.toLowerCase() === "pending" ? "text-yellow-700" : "text-red-700"}`}>{template?.status}</span>
                                    </div>
                                </div>
                            ))
                        }
                        <div className='flex flex-row items-center justify-end'>
                            <Link to={"/templates"} className='text-green-500 text-sm font-medium flex flex-row gap-x-2 p-2 items-center'>
                                <span>Manage Templates</span>
                                <MdArrowRightAlt size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WhatsappConnectionSetting