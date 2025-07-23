import React, { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { CgClose } from 'react-icons/cg'
import { useDispatch, useSelector } from 'react-redux';
import { addingSelectedContacts } from '../../redux/contactsPage/contactsFromAPI';

const SelectRecipientsDialog = ({ closeDialog }) => {

    const [activeButton, setActiveButton] = useState("");
    const [searchContacts, setSearchContacts] = useState("");

    // Getting Contacts from Redux Store
    const addingContactsToStore = useSelector((state) => state.allContacts?.selectedContacts);
    const contacts = useSelector((state) => state?.allContacts?.allContacts[0]?.users);
    const dispatch = useDispatch();

    // Handling buttons using Event Deligation
    const handlingMultipleButtons = (e) => {
        setActiveButton(e?.target?.textContent);
    }

    const handleSelectedContacts = (contact) => {
        const existingContact = contacts?.find((existing) => existing?.id === contact?.id);
        if (existingContact) {
            dispatch(addingSelectedContacts(contact));
        }
    }

    return (
        <div className='bg-white divide-y divide-gray-300 rounded-2xl shadow-sm flex flex-col w-[600px]'>
            <div className='p-4 flex flex-row items-center justify-between w-full'>
                <div>
                    <h2 className='text-gray-800 font-medium text-lg'>Select Recipients</h2>
                </div>
                <button onClick={closeDialog} className='p-1 rounded-xl hover:bg-gray-100 hover:text-gray-600 cursor-pointer'>
                    <CgClose size={15} color='gray' />
                </button>
            </div>

            {/* A search box to search for all contacts based on the changing of the input */}
            <div className='p-4 flex flex-col w-full space-y-5'>
                <div className='relative'>
                    <input type="text" value={searchContacts} onChange={(e) => setSearchContacts(e.target.value)} className='border outline-green-500 border-gray-200 w-full rounded-xl px-3 py-2 pl-7' placeholder='Search for contacts....' />
                    <div className='absolute top-3.5 left-2'>
                        <BiSearch size={15} color='gray' />
                    </div>
                </div>

                {/* Buttons for selecting contacts */}
                <div onClick={handlingMultipleButtons} className='flex flex-row gap-x-3'>
                    <button className={`flex flex-row cursor-pointer items-center justify-center px-3 py-1 rounded-full ${activeButton === "Recent Contacts" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"} font-medium text-sm`}>
                        Recent Contacts
                    </button>
                    <button className={`flex flex-row cursor-pointer items-center justify-center px-3 py-1 rounded-full ${activeButton === "All Contacts" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"} font-medium text-sm`}>
                        All Contacts
                    </button>
                    <button className={`flex flex-row cursor-pointer items-center justify-center px-3 py-1 rounded-full ${activeButton === "Groups" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"} font-medium text-sm`}>
                        Groups
                    </button>
                </div>
            </div>

            <div className='flex flex-col items-center w-full divide-y divide-gray-200 h-[200px] overflow-y-auto'>
                {
                    contacts?.filter((filteredContacts) => (filteredContacts?.first_name + filteredContacts?.last_name)?.trim()?.
                        toLowerCase()?.includes(searchContacts?.trim()?.toLowerCase()))?.map((contact, index) => {
                            const contactName = contact?.first_name + " " + contact?.last_name;
                            const contactEmail = contact?.email;
                            return (
                                <div onClick={() => handleSelectedContacts(contact)} key={index} className='flex flex-row w-full px-4 py-3 cursor-pointer hover:bg-gray-50'>
                                    <div className='flex items-center justify-center gap-x-2'>
                                        <div>
                                            <input type="checkbox" onChange={() => handleSelectedContacts(contact)} checked={!!addingContactsToStore.find((selected) => selected?.id === contact?.id)} name={contact?.id} id={"contact" + index} className='cursor-pointer accent-green-600 h-4 w-4' />
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className='text-gray-800 font-medium text-sm'>{contactName} </span>
                                            <span className='text-gray-500 text-xs'>{contactEmail}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                }
            </div>

            <div className="flex flex-row items-start justify-between gap-x-3 bg-gray-100 p-5">
                <div className=''>
                    <span className='text-gray-500 text-sm'>{addingContactsToStore?.length + ": "} recipients selected</span>
                </div>
                <div className="flex flex-row items-center gap-x-3">
                    <button className='bg-gray-100  cursor-pointer rounded-lg border border-gray-300 text-gray-600 px-3 py-2 shadow-sm font-medium text-sm'>
                        Cancel
                    </button>
                    <button className='bg-green-500 cursor-pointer  rounded-lg px-3 py-3 shadow-sm border-gray-200 border text-white font-medium text-sm'>
                        Add Selected
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SelectRecipientsDialog