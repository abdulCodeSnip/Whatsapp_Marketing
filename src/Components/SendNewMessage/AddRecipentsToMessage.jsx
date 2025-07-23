import React, { useState } from 'react'
import { BiUserPlus } from 'react-icons/bi';
import { BsExclamationCircle } from 'react-icons/bs';
import { CgClose, CgUserAdd } from 'react-icons/cg';
import { FaRegNewspaper } from 'react-icons/fa';
import { IoNewspaperOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import MessageContent from './MessageContent';
import SelectRecipientsDialog from './SelectRecipientsDialog';
import { addingSelectedContacts, allContacts, removeSelectedContacts } from '../../redux/contactsPage/contactsFromAPI';
import CustomToggle from './CustomToggle';
import ScheduleMessage from './ScheduleMessage';
import { scheduleMessage } from '../../redux/sendNewMessage/sendMessage';

const AddRecipentsToMessage = () => {

    const [searchContacts, setSearchContacts] = useState("");
    const [showRecipientsDialog, setShowRecipientsDialog] = useState(false);

    // Values from Redux to manange everything globally
    const auth = useSelector((state) => state?.auth?.authInformation);
    const contactsFromAPI = useSelector((state) => state?.allContacts?.allContacts);
    const addedAndSelectedContacts = useSelector((state) => state.allContacts?.selectedContacts);
    const scheduledMessage = useSelector((state) => state?.messageContent?.message);


    const dispatch = useDispatch();

    const fetchUsersFromAPI = async () => {
        try {
            const apiResponse = await fetch(`${auth?.at(0)?.baseURL}/contacts`, {
                method: "GET",
                headers: {
                    "Authorization": auth?.at(0)?.token
                }
            });

            const result = await apiResponse.json();
            if (apiResponse.ok) {
                dispatch(allContacts(result))
            }
        } catch (error) {
            console.log("Something went wrong at the backend " + error.message);
        }
    }
    fetchUsersFromAPI();

    const removeSelectedContactFromList = (contact) => {
        dispatch(removeSelectedContacts(contact));
    }

    return (
        <div className='bg-white rounded-xl shadow-sm flex flex-col divide-y divide-gray-300'>

            <div className='space-y-5 p-5'>
                <div>
                    <h2 className='text-lg font-medium text-gray-900'>
                        Recipients
                    </h2>
                </div>

                {
                    addedAndSelectedContacts && (
                        <div className='flex flex-row items-center gap-x-3'>
                            {
                                addedAndSelectedContacts?.map((selectedContact) => (
                                    <button className='flex flex-row items-center justify-center bg-gray-100 rounded-xl px-3 py-1 text-xs text-gray-600'>
                                        {
                                            selectedContact?.first_name + " " + selectedContact?.last_name
                                        }
                                        <span onClick={() => removeSelectedContactFromList(selectedContact)} className='p-[4px] hover:bg-gray-200 rounded-full cursor-pointer'>
                                            <CgClose size={10} />
                                        </span>
                                    </button>
                                ))
                            }
                        </div>
                    )
                }

                {/* Search for contacts through an Input */}
                <div className='flex flex-row items-center justify-between gap-5'>
                    <div className='w-full'>
                        <input type="text" className='px-3 py-2 rounded-xl border border-gray-300 outline-green-500 w-full' placeholder='Search contacts or groups to send message .....' onChange={(e) => setSearchContacts(e.target.value)} />
                    </div>

                    {/* Add Recipients Button to select groups of contacts for sending message */}
                    <div>
                        <button onClick={() => setShowRecipientsDialog(true)} className="flex w-[180px] items-center justify-center bg-gray-100 text-gray-600 gap-x-2 cursor-pointer px-3 py-2 rounded-lg">
                            <BiUserPlus size={20} />
                            <span>Add Recipients</span>
                        </button>
                    </div>
                </div>

                {/* Option for individual contacts */}
                <div className='flex flex-row items-center text-gray-700 gap-x-1'>
                    <input type="checkbox" id='individualContacts' name="individualContacts" className='accent-green-600 w-4 h-4' />
                    <label htmlFor="individualContacts">
                        Send individually to each recipient
                    </label>
                    <BsExclamationCircle />
                </div>
            </div>

            {/* Message Content from other component */}
            <MessageContent />
            {/* show the dialog if add recipients button was pressed */}
            {
                showRecipientsDialog && (
                    <>
                        <div className='fixed inset-0 bg-black/30 z-40'>
                        </div>

                        {/*show recipients dialog to select contacts and insert them to the message */}
                        <div className='fixed z-50 top-20 right-96 xl:right-96 lg:right-60 md:right-40 sm:right-20 @max-xs:right-10 md:w-auto'>
                            <SelectRecipientsDialog closeDialog={() => setShowRecipientsDialog(false)} />
                        </div>
                    </>
                )
            }
            <div>
                <ScheduleMessage />
            </div>
        </div>
    )
}

export default AddRecipentsToMessage