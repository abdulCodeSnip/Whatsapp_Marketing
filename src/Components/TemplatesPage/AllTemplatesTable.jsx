import React, { Fragment, useEffect, useState, useCallback } from 'react'
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
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchDebounce, setSearchDebounce] = useState("");

    // an object used for navigating user "pragrammatically"
    const navigate = useNavigate();

    // Custom hook to fetch templates
    const { 
        isLoading, 
        isError, 
        fetchedTemplates,
        allTemplates, 
        successMsgOnDelete, 
        fetchAllTemplates, 
        deleteTemplate 
    } = useFetchTemplates();

    // Client-side filtered templates
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const [paginatedTemplates, setPaginatedTemplates] = useState([]);
    const itemsPerPage = 10;


    // Client-side filtering effect
    useEffect(() => {
        if (!allTemplates.length) {
            setFilteredTemplates([]);
            setPaginatedTemplates([]);
            return;
        }

        let filtered = allTemplates.filter((template) => {
            const matchesSearch = !searchTemplatesByName || 
                template?.name?.toLowerCase().includes(searchTemplatesByName.toLowerCase());
            const matchesCategory = !sortByCategory || 
                template?.category?.name?.toLowerCase() === sortByCategory.toLowerCase();
            const matchesStatus = !sortByStatus || 
                template?.status?.toLowerCase() === sortByStatus.toLowerCase();
            
            return matchesSearch && matchesCategory && matchesStatus;
        });

        setFilteredTemplates(filtered);
        
        // Reset to first page when filters change
        if (currentPage > 1) {
            setCurrentPage(1);
        }
    }, [allTemplates, searchTemplatesByName, sortByCategory, sortByStatus]);

    // Client-side pagination effect
    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginated = filteredTemplates.slice(startIndex, endIndex);
        setPaginatedTemplates(paginated);
    }, [filteredTemplates, currentPage]);

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
            setSearchDebounce("");
            setCurrentPage(1);
        }
    }

    // Delete a template based on its ID
    const deleteTemplateByID = async (template_ID) => {
        setIsDeleting(true);
        try {
            const success = await deleteTemplate(template_ID);
            if (success) {
                setShowDeleteTemplateDialog(false);
                setSelectedTemplateId(null);
            }
        } catch (error) {
            console.error("Error while Deleting Template\n", error.message);
        } finally {
            setIsDeleting(false);
        }
    }

    // Calculate pagination data from filtered templates
    const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
    const totalItems = filteredTemplates.length;

    //pagination for move from one page to another page
    const handlePaginationButtons = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (typeof direction === "number") {
            setCurrentPage(direction);
        }
    }

    // Generate page numbers for pagination
    const generatePageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        
        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }

    return (
        <>
            {/* Success/Error Messages */}
            {successMsgOnDelete && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {successMsgOnDelete}
                    </div>
                </div>
            )}

            <div className='bg-white flex flex-row items-center justify-between p-[14px] shadow-xs rounded-xl'>

                {/* Search in Templates, also with "Category Sorting", "Status Sorting" */}
                <div className='flex flex-row items-center justify-between gap-x-5'>
                    <div className='flex flex-col items-start justify-center gap-1'>
                        <p className='text-gray-700 font-medium text-sm mx-2'>Search Template</p>
                        <input
                            name='searchInputsByName'
                            id="searchInputsByName"
                            value={searchTemplatesByName}
                            onChange={(e) => {
                                handleSearchTemplates("searchByName", e.target.value);
                            }}
                            placeholder="Search by name..."
                            className='px-3 py-2 outline-none flex w-[340px] focus:border-black border-gray-200 border-1 rounded-lg' 
                        />
                    </div>

                    {/* Category Sorting Button with Multiple Options */}
                    <div className='flex flex-col items-start justify-center gap-1'>
                        <p className='text-gray-700 font-medium text-sm'>Category</p>
                        <select 
                            name='sortByCategory' 
                            id='sortByCategory' 
                            value={sortByCategory}
                            onChange={(e) => handleSearchTemplates("sortByCategory", e.target.value)} 
                            className='px-4 py-2 rounded-lg border-1 text-gray-700 cursor-pointer border-gray-300 focus:border-black'
                        >
                            <option value={""}>All Category</option>
                            <option value={"MARKETING"}>Marketing</option>
                            <option value={"UTILITY"}>Utility</option>
                            <option value={"AUTHENTICATION"}>Authentication</option>
                            <option value={"OTP"}>OTP</option>
                        </select>
                    </div>

                    {/* Template status Sorting */}
                    <div className='flex flex-col items-start justify-center gap-1'>
                        <p className='text-gray-700 font-medium text-sm'>Status</p>
                        <select
                            name="sortByStatus" 
                            id='sortByStatus'
                            value={sortByStatus}
                            onChange={(e) => handleSearchTemplates("sortByStatus", e.target.value)}
                            className='pl-3 pr-12 shadow-sm appearance-auto py-2 rounded-lg cursor-pointer border-1 text-gray-700 border-gray-300 focus:border-black'
                        >
                            <option value={""}>All Statuses</option>
                            <option value={"Approved"}>Approved</option>
                            <option value={"Pending"}>Pending</option>
                            <option value={"Rejected"}>Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Reset Filters Button */}
                <div 
                    onClick={() => handleSearchTemplates("resetAllFilters")} 
                    className='border-gray-300 border-1 px-4 py-2 rounded-lg hover:bg-gray-50 bg-white cursor-pointer'
                >
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
                            {isLoading ? (
                                // Simple loading state
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Spinner size="large" />
                                            <p className="text-gray-500 mt-4 text-sm">Loading templates...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : isError ? (
                                // Error state
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="text-red-500 mb-2">
                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Templates</h3>
                                            <p className="text-gray-500 text-sm mb-4">{isError}</p>
                                            <button 
                                                onClick={() => fetchAllTemplates()}
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedTemplates?.length === 0 ? (
                                // Empty state
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="text-gray-400 mb-4">
                                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Found</h3>
                                            <p className="text-gray-500 text-sm">
                                                {searchTemplatesByName || sortByCategory || sortByStatus 
                                                    ? "No templates match your current filters. Try adjusting your search criteria."
                                                    : "You haven't created any templates yet. Create your first template to get started."
                                                }
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                // Templates data
                                paginatedTemplates?.map((template) =>
                                    <Fragment key={template?.id}>
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
                                                    deleteTemplateCompletely={() => deleteTemplateByID(template?.id)}
                                                    closeDialog={() => setShowDeleteTemplateDialog(false)}
                                                    isDeleting={isDeleting}
                                                />
                                            </div>
                                        }
                                    </Fragment>
                                )
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {!isLoading && filteredTemplates?.length > 0 && (
                        <div className='flex flex-row items-center justify-between bg-gray-100'>
                            <div>
                                <h2 className='text-gray-600 text-md px-5 py-2'>
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                                </h2>
                            </div>

                            {totalPages > 1 && (
                                <div className='flex flex-row divide-x-1 text-gray-500 divide-gray-200 rounded-2xl border-gray-200 border-1 m-3'>
                                    {/* Previous button */}
                                    <button 
                                        onClick={() => handlePaginationButtons("prev")} 
                                        disabled={currentPage === 1}
                                        className={`w-[40px] h-[40px] rounded-l-2xl flex items-center justify-center ${
                                            currentPage === 1 
                                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                                                : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                                        }`}
                                    >
                                        <IoIosArrowBack size={15} />
                                    </button>

                                    {/* Page numbers */}
                                    {generatePageNumbers().map((pageNum) => (
                                        <button 
                                            key={pageNum}
                                            onClick={() => handlePaginationButtons(pageNum)} 
                                            className={`w-[40px] h-[40px] flex items-center justify-center ${
                                                currentPage === pageNum 
                                                    ? "bg-green-500 text-white hover:bg-green-400" 
                                                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                            } cursor-pointer`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}

                                    {/* Next button */}
                                    <button 
                                        onClick={() => handlePaginationButtons("next")} 
                                        disabled={currentPage === totalPages}
                                        className={`w-[40px] h-[40px] rounded-r-2xl flex items-center justify-center ${
                                            currentPage === totalPages 
                                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                                                : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                                        }`}
                                    >
                                        <IoIosArrowForward size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
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