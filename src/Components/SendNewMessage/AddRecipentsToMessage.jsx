import { Fragment, useState, useEffect, useRef } from 'react'
import { BiCheck, BiUserPlus, BiSearch } from 'react-icons/bi';
import { BsExclamationCircleFill } from 'react-icons/bs';
import { CgClose } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';
import MessageContent from './MessageContent';
import SelectRecipientsDialog from './SelectRecipientsDialog';
import { removeSelectedContacts, addingSelectedContacts } from '../../redux/contactsPage/contactsFromAPI';
import ScheduleMessage from './ScheduleMessage';
import useFetchAllContacts from '../../hooks/Contacts Hook/useFetchAllContacts';
import Spinner from "../../Components/Spinner";

const AddRecipentsToMessage = () => {

    const [searchContacts, setSearchContacts] = useState("");
    const [showRecipientsDialog, setShowRecipientsDialog] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // Ref for search dropdown
    const searchDropdownRef = useRef(null);

    // Values from Redux to manange everything globally, selected contacts for message to be send, and selectedTemplate
    const addedAndSelectedContacts = useSelector((state) => state.allContacts?.selectedContacts);
    const errorOrSuccessMsg = useSelector((state) => state?.errorOrSuccessMessage?.errorMessage);
    const selectedTemplate = useSelector((state) => state?.selectedTemplate?.selected);

    const dispatch = useDispatch();

    // A custom hook that will give us all the contacts from the database
    const { isLoading, isError, fetchContacts } = useFetchAllContacts();

    // Store all contacts when they are fetched
    useEffect(() => {
        if (fetchContacts?.length > 0) {
            setAllContacts(fetchContacts);
        }
    }, [fetchContacts]);

    // Handle outside click to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    // Show/hide dropdown based on search input
    useEffect(() => {
        setShowDropdown(searchContacts.trim().length > 0);
    }, [searchContacts]);

    const removeSelectedContactFromList = (contact) => {
        dispatch(removeSelectedContacts(contact));
    }

    const handleSelectContact = (contact) => {
        dispatch(addingSelectedContacts(contact));
        setSearchContacts(""); // Clear search after selection
        setShowDropdown(false);
    }

    // Filter contacts based on search input
    const getFilteredContacts = () => {
        if (!searchContacts.trim()) return [];
        
        return allContacts.filter(contact => {
            const contactName = (contact?.first_name + " " + contact?.last_name).toLowerCase();
            const contactEmail = contact?.email?.toLowerCase() || "";
            const contactPhone = contact?.phone?.toLowerCase() || "";
            const searchTerm = searchContacts.toLowerCase().trim();
            
            return contactName.includes(searchTerm) || 
                   contactEmail.includes(searchTerm) || 
                   contactPhone.includes(searchTerm);
        }).filter(contact => 
            // Don't show already selected contacts
            !addedAndSelectedContacts.find(selected => selected.id === contact.id)
        ).slice(0, 5); // Limit to 5 results for better UX
    };

    const filteredContacts = getFilteredContacts();

    // Handle search input changes
    const handleSearchChange = (e) => {
        setSearchContacts(e.target.value);
    };

    // Handle escape key to close dropdown
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowDropdown(false);
            setSearchContacts("");
        }
    };

    if (isLoading || isError) return (
        <div className='h-screen w-screen items-center justify-center'>
            <Spinner size="small" />
        </div>
    )

    return (
        <div className='bg-white rounded-xl shadow-sm flex flex-col divide-y divide-gray-300'>

            <div className='space-y-5 p-5'>
                <div>
                    <h2 className='text-lg font-medium text-gray-900'>
                        Recipients
                    </h2>
                </div>

                {
                    errorOrSuccessMsg?.message && (
                        <div className={`${errorOrSuccessMsg?.type === "Success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"} px-5 flex flex-row items-center gap-3 py-3 font-medium rounded-2xl text-xs shadow-xl z-40 fixed top-12 right-12 `}>
                            {
                                errorOrSuccessMsg?.type === "Error" ?
                                    <div className='p-[2px] rounded-full border border-red-600'>
                                        <BsExclamationCircleFill size={18} />
                                    </div> :
                                    <div className='p-[2px] rounded-full border border-green-600'>
                                        <BiCheck size={18} />
                                    </div>
                            }
                            {
                                errorOrSuccessMsg?.message
                            }
                            <div>
                            </div>
                        </div>
                    )
                }
                {
                    addedAndSelectedContacts && (
                        <div className='flex flex-row items-center gap-x-3'>
                            {
                                addedAndSelectedContacts?.map((selectedContact, index) => (
                                    <button key={index} className='flex flex-row items-center justify-center bg-gray-100 rounded-xl px-3 py-1 text-xs text-gray-600'>
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

                {/* Search for contacts through an Input inside the dialog for contacts */}
                <div className='flex flex-row items-center justify-between gap-5 relative'>
                    <div className='w-full relative' ref={searchDropdownRef}>
                        <div className="relative">
                            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                id='searchContactsToAdd' 
                                name='searchContactsToAdd' 
                                value={searchContacts}
                                className='px-3 py-2 pl-10 rounded-xl border border-gray-300 outline-green-500 w-full' 
                                placeholder='Search contacts to send message .....' 
                                onChange={handleSearchChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        
                        {/* Dropdown with filtered contacts */}
                        {showDropdown && filteredContacts.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                                {filteredContacts.map((contact, index) => (
                                    <div
                                        key={contact.id || index}
                                        onClick={() => handleSelectContact(contact)}
                                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">
                                                {contact?.first_name} {contact?.last_name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {contact?.email}
                                            </span>
                                            {contact?.phone && (
                                                <span className="text-xs text-gray-400">
                                                    {contact?.phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* No results message */}
                        {showDropdown && searchContacts.trim() && filteredContacts.length === 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
                                <div className="p-3 text-sm text-gray-500 text-center">
                                    No contacts found matching "{searchContacts}"
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Add Recipients Button to select groups of contacts for sending message */}
                    <div>
                        <button onClick={() => setShowRecipientsDialog(true)} className="flex w-[180px] items-center justify-center bg-gray-100 text-gray-600 gap-x-2 cursor-pointer px-3 py-2 rounded-lg">
                            <BiUserPlus size={20} />
                            <span>Add Recipients</span>
                        </button>
                    </div>
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
        </div>
    )
}

export default AddRecipentsToMessage