import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changingSuccessMessage } from '../../redux/importContactsCSV/importCSV';

const PreviewMapData = ({ moveBackward, moveForward }) => {

    // Values from Redux
    const importedContacts = useSelector((state) => state.importedContacts?.importedContacts);
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
    const selectedFile = useSelector((state) => state?.selectedFile?.file);
    const messageOnSuccess = useSelector((state) => state?.selectedFile?.messageOnComplete);
    const dispatch = useDispatch();


    const [validatePhone, setValidatePhone] = useState(false);
    const [newGroupName, setNewGroupName] = useState("Customers June 2025");

    const tableHeader = ["First Name", "Last Name", "Phone Number", "Email", "Company", "Country"];

    // Import contacts file to the server
    const importFileToDataBase = async () => {
        try {
            const formData = new FormData();
            formData.append("file", selectedFile[0]);
            const apiResponse = await fetch(`${authInformation?.baseURL}/contacts/import-csv`, {
                method: "POST",
                headers: {
                    "Authorization": authInformation?.token,
                },
                body: formData
            });
            const result = await apiResponse.json();
            if (apiResponse.ok && apiResponse.status === 200) {
                dispatch(changingSuccessMessage("Contacts Imported Successfully"));
            } else {
                console.log("Something is bad with your request");
            }
        } catch (error) {
            console.log("Bad Request from the API", error);
        }
    }

    return (
        <div className="flex flex-col bg-white p-5 shadow-sm rounded-xl space-y-3 w-full">
            <div>
                <h2 className="text-lg font-medium text-gray-800">Preview Imported Contacts</h2>
                <span className='text-sm text-gray-600'>Review your data before importing, first 5 results from file are below</span>
            </div>

            {/* Table to preview data from the Redux store that was just picked by a file, and that data would be inside this table */}
            <div className='rounded-lg shadow-sm'>
                <table className='w-full rounded-lg divide-y divide-gray-300 overflow-x-auto'>
                    <thead>
                        <tr className='bg-gray-100'>
                            {tableHeader.map(th => (
                                <th className='text-gray-600 uppercase text-sm text-left font-medium whitespace-nowrap p-4' key={th}>
                                    {th}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-300'>
                        {
                            importedContacts?.map((contacts, index) => (
                                index + 1 <= 5 &&
                                <tr key={index}>
                                    <td scope='col' className='text-gray-500 text-sm p-4 text-left'>{contacts?.firstname}</td>
                                    <td scope='col' className='text-gray-500 text-sm p-4 text-left'>{contacts?.lastname}</td>
                                    <td scope='col' className='text-gray-500 text-sm p-4 text-left'>{contacts?.phone_number}</td>
                                    <td scope='col' className='text-gray-500 text-sm p-4 text-left'>{contacts?.email}</td>
                                    <td scope='col' className='text-gray-500 text-sm p-4 text-left'>{contacts?.company}</td>
                                    <td scope='col' className='text-gray-500 text-sm p-4 text-left'>{contacts?.country}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <div className='flex flex-row justify-between overflow-hidden'>
                <div>
                    <span className='text-gray-600 text-sm'>Showing 5 results out of {importedContacts?.length}</span>
                </div>
                <div className='flex flex-row divide-x divide-gray-600 gap-2'>
                    <div>
                        <span className='text-gray-500 text-sm pr-2'>Total valid records: <span className='text-gray-900 font-medium'>{importedContacts?.length}</span></span>
                    </div>
                    <div>
                        <span className='text-gray-500 text-sm'>Invalid records : <span className='text-red-600 font-medium'>0</span> </span>
                    </div>
                </div>
            </div>

            {/* Options for Selecting contacts, such as duplicate contacts, skip duplicates and valiate phone numbers */}
            <div className='flex flex-row items-center justify-between gap-3 p-3 border-b-1 border-gray-300'>
                <div className='flex flex-col space-y-4'>
                    <h2 className="text-lg font-medium text-gray-800">Duplicates Handling</h2>
                    <div className='flex flex-col gap-3'>
                        <label className='flex gap-x-1 text-sm text-gray-600'>
                            <input type="radio" name="duplicate-handling" id='duplicate-handling' className='w-5 h-5' />
                            <span>Skip Duplicates (do not import)</span>
                        </label>
                        <label className='flex gap-x-1 text-sm text-gray-600'>
                            <input type="radio" name="duplicate-handling" id='duplicate-handling' className='w-5 h-5' />
                            <span>Update existing contacts</span>
                        </label>
                        <label className='flex gap-x-1 text-sm text-gray-600'>
                            <input type="radio" name="duplicate-handling" id='duplicate-handling' className='w-5 h-5' />
                            <span>Allow Duplicates</span>
                        </label>
                    </div>
                </div>

                {/* Validate Phone numbers Option */}
                <div className='flex flex-col gap-3'>
                    <h2 className="text-lg font-medium text-gray-800">Validate Options</h2>
                    <label className="relative inline-flex items-center cursor-pointer gap-2">
                        <input
                            type="checkbox"
                            checked={validatePhone}
                            onChange={() => setValidatePhone(!validatePhone)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                        <span className='text-sm font-medium text-gray-600'>Validate Phone Numbers</span>
                    </label>
                    <div className='text-gray-500 text-sm'>
                        <span>Ensures all phone numbers are in a valid format for WhatsApp</span>
                    </div>
                </div>
            </div>

            {/* Contact Groups */}
            <div className='flex flex-col gap-4'>
                <div>
                    <h2 className='text-lg font-medium text-gray-800'>Contact Group</h2>
                </div>
                <div className='flex flex-col space-y-3'>
                    <label className='items-center flex flex-row gap-2'>
                        <input type="radio" name="contact-group" id="contact-group" className='h-5 w-5' />
                        <span className='text-gray-600 text-sm'>Create new contact group</span>
                    </label>
                    <div>
                        <input type="text" id='newGroup' placeholder='New group name' value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className='text-gray-800 text-sm rounded-lg border border-gray-300 outline-green-500 px-4 py-2' />
                    </div>
                    <label className='items-center flex flex-row gap-2'>
                        <input type="radio" name="contact-group" id="contact-group" className='h-5 w-5' />
                        <span className='text-gray-600'>Add to existing group</span>
                    </label>
                    <div>
                        <select name="existingGroup" id="existingGroup" className='text-gray-800 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-green-500'>
                            <option value="">Select a Group</option>
                            <option value="vipCustomers">VIP Customers</option>
                            <option value="newsletterSubscribers">Newsletter Subscribers</option>
                            <option value="eventAttendees">Event Attendees</option>
                            <option value="productLaunchProspects">Product Launch Prospects</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Start importing of contacts or move backward with "Back" button */}
            <div className="flex flex-row items-center justify-between my-3">
                <button onClick={moveBackward} className="px-4 py-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg shadow-sm shadow-gray-200 font-medium">
                    Back
                </button>
                <button onClick={() => {
                    moveForward();
                    importFileToDataBase();
                }} className="px-4 py-2 text-white bg-green-500 font-medium border border-gray-200 rounded-lg shadow-sm shadow-gray-200">
                    Start Import
                </button>
            </div>
        </div>
    )
}

export default PreviewMapData