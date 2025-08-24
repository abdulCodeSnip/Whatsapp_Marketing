import React, { useEffect, useState } from 'react'
import useFetchTemplates from '../../hooks/useFetchTemplates'
import Spinner from '../Spinner';
import TemplateListingCard from '../templateListingCard';
import DeleteTemplateCard from '../deleteTemplateCard';
import { FaRotate } from 'react-icons/fa6';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const AllTemplatesTable = () => {

    const [sortByStatus, setSortByStatus] = useState("");
    const [sortByCategory, setSortByCategory] = useState("");
    const [searchTemplatesByName, setSearchTemplatesByName] = useState("");
    const [showDeleteTemplateDialog, setShowDeleteTemplateDialog] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [successMsgOnDelete, setSuccessMsgOnDelete] = useState("");
    const [selectedPage, setSelectedPage] = useState(null);

    // an object used for navigating user "pragrammatically"
    const navigate = useNavigate();

    // Custom hook to fetch templates
    const { isLoading, isError, templates } = useFetchTemplates();


    // Sorting of Templates Based on "Search Value", "Category", "Status"
    const handleSearchTemplates = (type, value) => {
        if (type === "searchByName") {
            setSearchTemplatesByName(value);
        } else if (type === "sortByCategory") {
            setSortByCategory(value);
        } else if (type === "sortByStatus") {
            setSortByStatus(value);
        } else if (type === "resetAllFilters") {
            setSortByCategory("");
            setSortByStatus("");
            setSearchTemplatesByName("");
        }
    }

    // Delete a template based on its ID
    const deleteTemplateByID = async (template_ID) => {
        try {
            const apiResponse = await fetch(`${baseURL}/templates/${template_ID}`, {
                method: "DELETE",
                headers: {
                    "Authorization": authInformation?.token,
                }
            });
            const result = await apiResponse.json();
            if (apiResponse.ok) {
                setSuccessMsgOnDelete(result?.message);
            }
        } catch (error) {
            console.error("Error while Deleting Template\n", error.message);
        }
    }

    const handlePaginationButtons = (value) => {
        setSelectedPage(value);
    }

    useEffect(() => {
        handlePaginationButtons(selectedPage)
    }, [selectedPage])
    
    return (
        <>
            <div className='bg-white flex flex-row items-center justify-between p-[14px] shadow-xs rounded-xl'>

                {/* Search in Templates, also with "Category Sorting", "Status Sorting" */}
                <div className='flex flex-row items-center justify-between gap-x-5'>
                    <div className='flex flex-col items-start justify-center gap-1'>
                        <p className='text-gray-700 font-medium text-sm mx-2'>Search Template</p>
                        <input
                            value={searchTemplatesByName}
                            onChange={(e) => {
                                handleSearchTemplates("searchByName", e.target.value);
                                setSearchTemplatesByName(e.target.value);
                            }}
                            placeholder="Search by name..."
                            className='px-3 py-2 outline-none flex w-[340px] focus:border-black border-gray-200 border-1 rounded-lg' />
                    </div>

                    {/* Category Sorting Button with Multiple Options */}
                    <div className='flex flex-col items-start justify-center gap-1'>
                        <p className='text-gray-700 font-medium text-sm'>Category</p>
                        <select onChange={(e) => handleSearchTemplates("sortByCategory", e.target.value)} className='px-4 py-2 rounded-lg border-1 text-gray-700 cursor-pointer border-gray-300 focus:border-black'>
                            <option value={""}>All Category</option>
                            <option value={"Marketing"}>Marketing</option>
                            <option value={"Transactional"}>Transactional</option>
                            <option value={"Authentication"}>Authentication</option>
                            <option value={"Utility"}>Utility</option>
                            <option value={"Customer Support"}>Customer Support</option>
                        </select>
                    </div>

                    {/* Template status Sorting */}
                    <div className='flex flex-col items-start justify-center gap-1'>
                        <p className='text-gray-700 font-medium text-sm'>Status</p>
                        <select
                            onChange={(e) => handleSearchTemplates("sortByStatus", e.target.value)}
                            className='pl-3 pr-12 shadow-sm appearance-auto py-2 rounded-lg cursor-pointer border-1 text-gray-700 border-gray-300 focus:border-black'>
                            <option value={""}>All Statuses</option>
                            <option value={"Approved"}>Approved</option>
                            <option value={"Pending"}>Pending</option>
                            <option value={"Rejected"}>Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Reset Filters Button */}
                <div onClick={(e) => handleSearchTemplates("resetAllFilters", e.target.value)} className='border-gray-300 border-1 px-4 py-2 rounded-lg hover:bg-gray-50 bg-white cursor-pointer'>
                    <div className='flex flex-row items-center gap-x-2 justify-center text-gray-700 cursor-pointer'>
                        <FaRotate />
                        <button className='cursor-pointer'>Reset Filters</button>
                    </div>
                </div>
            </div>

            {/* Table to showcase all the templates */}
            <div className='bg-white rounded-xl overflow-hidden border border-gray-200 my-5'>
                <div className='overflow-auto divide-y divide-gray-200'>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className='bg-gray-50'>
                            <tr>
                                <th scope="col" className='text-gray-500 font-medium px-6 tracking-wider uppercase text-xs text-left py-5'>Template Name</th>
                                <th scope="col" className='text-gray-500 font-medium px-6 tracking-wider uppercase text-xs text-left py-3'>Category</th>
                                <th scope="col" className='text-gray-500 font-medium px-6 tracking-wider uppercase text-xs text-left py-3'>Status</th>
                                <th scope="col" className='text-gray-500 font-medium px-6 tracking-wider uppercase text-xs text-left py-3'>Date Created</th>
                                <th scope="col" className='text-gray-500 font-medium px-6 tracking-wider uppercase text-xs text-left py-3'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200 space-y-2'>
                            {
                                // Default templates, we'll add real time templates later
                                templates?.templates?.filter((mytemp) => mytemp?.name?.toLowerCase()?.includes
                                    (searchTemplatesByName.toLowerCase()) &&
                                    (sortByCategory === "" || mytemp?.category?.name?.toLowerCase() === sortByCategory?.toLowerCase()) &&
                                    (sortByStatus === "" || mytemp?.status?.toLowerCase() === sortByStatus?.toLowerCase())
                                )
                                    .map((template) =>
                                        <>
                                            <TemplateListingCard
                                                templateName={
                                                    template?.name?.split(" ")?.map(tname => tname.charAt(0).toUpperCase() + tname.slice(1) + " ")}
                                                templateCategory={template?.category?.name}
                                                templateStatus={template?.status}
                                                templateCreateDate={template?.created_at?.split("T")?.at(0)}
                                                templateLanguage={template?.language}
                                                editTemplate={() => navigate(`/templates/${template?.id}`)}
                                                deleteTemplateAction={() => {
                                                    setShowDeleteTemplateDialog(true);
                                                    setSelectedTemplateId(template?.id);
                                                }}
                                            />


                                            {
                                                showDeleteTemplateDialog && selectedTemplateId === template?.id &&
                                                <div className='fixed top-52 z-50 right-[400px] bg-white rounded-2xl border-gray-200 border-1 p-5 w-md h-auto shadow-gray-200'>
                                                    <DeleteTemplateCard
                                                        title={"Delete Template"}
                                                        deleteTemplateCompletely={
                                                            () => deleteTemplateByID(template?.id)}
                                                        closeDialog={() => setShowDeleteTemplateDialog(false)}
                                                    />
                                                </div>
                                            }
                                        </>
                                    )
                            }

                        </tbody>
                    </table>

                    <div className='flex flex-row items-center justify-between bg-gray-100'>
                        <div>
                            <h2 className='text-gray-600 text-md px-5 py-2'>
                                Showing 1 to 6 of 12 results
                            </h2>
                        </div>

                        <div className='flex flex-row divide-x-1 text-gray-500 divide-gray-200 rounded-2xl border-gray-200 border-1 m-3'>
                            <button onClick={() => handlePaginationButtons(0)} className='w-[40px] h-[40px] rounded-l-2xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer'>
                                <IoIosArrowBack size={15} />
                            </button>
                            <button onClick={(e) => handlePaginationButtons(e.target.textContent)} className={`w-[40px] h-[40px] flex items-center justify-center ${selectedPage == 1 ? "bg-green-500 text-white hover:bg-green-400" : "bg-gray-50 text-gray-500"} hover:bg-gray-100 cursor-pointer`}>
                                1
                            </button>
                            <button onClick={(e) => handlePaginationButtons(e.target.textContent)} className={`w-[40px] h-[40px] flex items-center justify-center ${selectedPage == 2 ? "bg-green-500 text-white hover:bg-green-400" : "bg-gray-50 text-gray-500"} hover:bg-gray-100 cursor-pointer`}>
                                2
                            </button>
                            <button onClick={() => handlePaginationButtons(0)} className='w-[40px] h-[40px] rounded-r-2xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer'>
                                <IoIosArrowForward size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* if Delete Template icon is pressed, then we'll show the dialog box for confirmation to delete that template */}
                {showDeleteTemplateDialog && (
                    <div className="fixed inset-0 bg-black/10 bg-opacity-20 h-[120vh] w-[120vw] z-40">
                        {/* This div is just for dimming the background if delete messages dialog is opened, otherwise the background would be smooth */}
                    </div>
                )}
            </div>
        </>

    )
}

export default AllTemplatesTable