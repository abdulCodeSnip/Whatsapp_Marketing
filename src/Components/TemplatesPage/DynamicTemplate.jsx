import React, { useEffect, useState } from 'react'
import SideBar from '../SideBar'
import CustomInput from '../customInput'
import { LuBellRing } from 'react-icons/lu'
import { BsQuestionCircle } from 'react-icons/bs'
import Hamburger from '../CreateNewTemplatePage/Hamburger'
import { redirect, useNavigate, useParams } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'
import { VscLoading } from 'react-icons/vsc'
import { FaCircleNotch } from 'react-icons/fa'
import { CgClose } from 'react-icons/cg'
import { GiCheckMark } from 'react-icons/gi'

const DynamicTemplate = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [templateDetail, setTemplateDetail] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTemplateUpdated, setIsTemplateUpdated] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [templateFormData, setTemplateFormData] = useState({
        templateName: templateDetail?.template?.name || "",
        templateLanguage: templateDetail?.template?.language || "",
        isTemplateActive: templateDetail?.template?.is_active || false,
        category: templateDetail?.template?.category?.name || "",
        isApproved: templateDetail?.template?.is_approved || "",
        status: "",
        templateMessage: templateDetail?.template?.message || "",
        templateVariables: templateDetail?.template?.variables || [],
    })

    const authInformation = {
        baseURL: "http://localhost:3000",
        token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImVtYWlsIjoiYXEyMDYwQGljbG91ZC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTI4MzEyNjMsImV4cCI6MTc1MjkxNzY2M30.xql9YKxEArvqGCr4bnlxtuTprzOaIwt5NEgM2lRkU7A"
    }
    const getTemplateById = async () => {
        try {
            const apiResponse = await fetch(`${authInformation.baseURL}/templates/${id.toString()}`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation.token
                }
            });
            const result = await apiResponse.json();
            setTemplateDetail(result);

            // Update form data as well
            setTemplateFormData({
                templateName: result?.template?.name || "",
                templateLanguage: result?.template?.language || "",
                isTemplateActive: result?.template?.is_active || false,
                category: result?.template?.category?.name || "",
                isApproved: result?.template?.is_approved || "",
                status: "",
                templateMessage: result?.template?.message || "",
                templateVariables: result?.template?.variables || [],
            });
        } catch (error) {
            console.log("Something went wrong at the Backend! " + error.message);
        }
    };

    useEffect(() => {
        getTemplateById();
    }, [id]);

    const updateTemplate = async () => {
        try {
            setIsLoading(true);
            const apiResponse = await fetch(`${authInformation.baseURL}/templates/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": authInformation.token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: templateFormData.templateName, message: templateFormData.templateMessage, is_active: true, category: templateFormData.category })
            });

            const result = await apiResponse.json();
            setSuccessMessage(result?.message);
            if (successMessage.includes("Successfully")) {
                setIsTemplateUpdated(true);
            }
            console.log(successMessage);
        } catch (error) {
            setIsTemplateUpdated(false);
            console.log("Something went wrong at the backend! " + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='flex overflow-hidden h-screen'>

            {/* SideBar at left side of the Screen */}
            <SideBar />

            {/* Main content with a header and some accessability buttons */}
            <div className='flex-1 flex flex-col h-screen overflow-hidden'>

                {/* Header of the dynamic Component */}
                <header className="bg-white shadow-sm z-10">
                    <div className="flex flex-row items-center justify-between h-16 px-6">

                        {/* Search To search for templates */}
                        <div>
                            <CustomInput
                                placeholder={"Search Templates...."}
                            />
                        </div>

                        {/* A div containing icons at right corner */}
                        <div className='flex flex-row items-center justify-between gap-x-5'>
                            <div className='text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-medium'>
                                <h2>Connected</h2>
                            </div>

                            <div className='cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-shadow' >
                                <LuBellRing size={20} color='gray' />
                            </div>

                            <div className='cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-all'>
                                <BsQuestionCircle size={20} color='gray' />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content of the dynamic screen */}
                <main className='flex-1 p-6 bg-gray-50 overflow-y-auto'>
                    <div className='max-w-7xl mx-auto space-y-2'>
                        <Hamburger firstLink={"Dashboard"} secondLink={"Templates"} thirdLink={`Template ${id}`} />
                        <div className='items-center space-y-4'>
                            <div className='items-center flex flex-row justify-between'>
                                <div>
                                    <h2 className='text-lg font-medium text-gray-800'>Edit Template</h2>
                                    <div>
                                        <p className='text-sm text-gray-500'>Edit and manage your Whatsapp templates</p>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        onClick={() => navigate("/templates")}
                                        className='flex flex-row items-center justify-center gap-x-2 hover:bg-gray-50 transition-all cursor-pointer text-gray-800 font-medium text-sm px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm'>
                                        <BiArrowBack />
                                        Back to Templates
                                    </button>
                                </div>
                            </div>
                            <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-x-5'>
                                <div className=''>
                                    <label
                                        htmlFor="templateName"
                                        className='text-md font-medium text-gray-600 block'>
                                        Template Name
                                    </label>
                                    <input
                                        type="text"
                                        id='templateName'
                                        placeholder='Template Name'
                                        className='text-sm rounded-lg w-full outline-green-500 overflow-y-auto overflow-x-hidden overscroll-contain border border-gray-300 px-3 py-2'
                                        value={templateFormData.templateName}
                                        onChange={(e) => setTemplateFormData({ ...templateFormData, templateName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="templateLanguage"
                                        className='text-md font-medium text-gray-600 block'>Template Language</label>
                                    <select name="templateLanguage"
                                        id="templateLanguage"

                                        onChange={(e) => setTemplateFormData({ ...templateFormData, templateLanguage: e.target.value })}
                                        className='text-sm w-full cursor-pointer outline-green-500 rounded-lg border border-gray-300 px-3 py-2' value={templateFormData.templateLanguage}>
                                        <option value="">Language</option>
                                        <option value="en-US">English US</option>
                                        <option value="en-AU">English AU</option>
                                        <option value="en-UK">English UK</option>
                                        <option value="hindi">Hindi</option>
                                        <option value="arabic">Arabic</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="templateCategory" className='text-md font-medium text-gray-600 block'>Template Category</label>
                                    <select
                                        className='text-sm w-full outline-green-500 cursor-pointer rounded-lg border border-gray-300 px-3 py-2'
                                        value={templateFormData.category}
                                        onChange={(e) => setTemplateFormData({ ...templateFormData, category: e.target.value })} name="templateCategory" id="templateCategory">
                                        <option value="">Category</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="transactionanl">Transactional</option>
                                        <option value="utility">Utility</option>
                                        <option value="customer_Support">Customer Support</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='my-5'>
                            <label
                                htmlFor="templateMessage"
                                className='block font-medium mb-1 text-md  text-gray-600'>Message Body</label>
                            <textarea
                                id="templateMessage"
                                rows={5}
                                className='xl:w-1/2 lg:w-[60%] md:w-full rounded-xl shadow-sm px-3 outline-green-500 py-2 border border-gray-300'
                                value={templateFormData?.templateMessage} onChange={(e) => setTemplateFormData({ ...templateFormData, templateMessage: e.target.value })} />
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    updateTemplate();
                                    setTimeout(() => {
                                        setSuccessMessage(null);
                                    }, 4000)
                                }}
                                disabled={(templateDetail?.template?.name === templateFormData?.templateName) || (templateDetail?.template?.category?.name === templateFormData.category) || (templateDetail?.template?.language === templateFormData?.templateLanguage)} className='bg-green-500 text-white px-3 py-2 rounded-lg shadow-sm disabled:opacity-80 cursor-pointer disabled:cursor-not-allowed flex flex-row items-center justify-center gap-x-2'>
                                {
                                    isLoading && (
                                        <div>
                                            <FaCircleNotch size={15} className="animate-spin" />
                                        </div>
                                    )
                                }
                                Update Template
                            </button>
                        </div>

                        {/* if template is updated! Show a success message */}
                        {
                            successMessage && (
                                <div className='fixed top-16 right-10 bg-green-100 rounded-l-xl rounded-tr-xl border border-gray-200 shadow-sm shadow-green-300 text-green-600 z-20 px-3 py-2 text-xs tracking-wide w-[220px] flex flex-row items-center gap-x-2'>
                                    <button className='p-[3px] rounded-full border-green-600 border'>
                                        <GiCheckMark size={10} />
                                    </button>
                                    <div>
                                        <span>
                                            {
                                                successMessage
                                            }
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSuccessMessage(null)
                                        }}
                                        className='p-[3px] rounded-full hover:bg-green-200 hover:text-green-800 cursor-pointer'>
                                        <CgClose size={14} />
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </main>
            </div>
        </div>
    )
}

export default DynamicTemplate