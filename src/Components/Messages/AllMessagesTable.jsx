import React, { Fragment, useState, useMemo } from 'react'
import useFetchMessages from '../../hooks/useFetchMessages';
import FullMessageOverview from '../fullMessageOverview';
import DeleteMessageDialog from '../deleteMessageDialog';
import ForwardMessageDialog from '../forwardMessageDialog';

const AllMessagesTable = ({ searchQuery = "" }) => {

    const [userMessages, setUserMessages] = useState([]);
    const [selectedMessagesIDs, setSelectedMessagesIDs] = useState([]);
    const [deleteMessageDialog, setDeleteMessageDialog] = useState(false);
    const [showForwardMessageDialog, setShowForwardMessageDialog] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState();

    // Add checkbox to another array, so many checkboxes can be checked at a time
    const handleCheckBoxIndividually = (id) => {
        setSelectedMessagesIDs((previous) => {
            if (previous.includes(id)) {
                // UnCheck, it will return all other elements which was unchecked
                return previous.filter((msgId) => msgId !== id);
            } else {
                // Checked
                return [...previous, id];
            }
        });
    }

    // Show the delete message dialog, if the delete message is pressed
    const handleDeleteMessage = (id) => {
        // Delete a message only by clicking a particular contact
        setUserMessages(prev => prev.filter(msg => msg.id !== id));
        setDeleteMessageDialog(false);

    }

    // Handle Message Forwarding Dialog 
    const handleMessageForwardDialog = () => {
        setShowForwardMessageDialog(true);
    }

    const { isLoading, isError, messages, currentUser } = useFetchMessages(20);

    // Filter messages based on search query
    const filteredMessages = useMemo(() => {
        if (!searchQuery.trim()) {
            return messages || [];
        }

        const query = searchQuery.toLowerCase().trim();
        
        return (messages || []).filter(userMsg => {
            const contactName = (currentUser?.user?.first_name + " " + currentUser?.user?.last_name).toLowerCase();
            const contactPhone = currentUser?.user?.phone?.toLowerCase() || "";
            const messageText = userMsg?.chat?.at(userMsg?.chat?.length - 1)?.content?.toLowerCase() || "";
            const messageStatus = userMsg?.chat?.at(userMsg?.chat?.length - 1)?.status?.toLowerCase() || "";

            return (
                contactName.includes(query) ||
                contactPhone.includes(query) ||
                messageText.includes(query) ||
                messageStatus.includes(query)
            );
        });
    }, [messages, currentUser, searchQuery]);

    return (
        <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-10">
                        <input name="checkbox" id="checkbox" type="checkbox" className="accent-green-600 w-[18px] h-[18px] rounded-xl outline-none border-green-400 cursor-pointer" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                        Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                        Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs min-w-[120px] font-medium text-gray-500 uppercase tracking-wider w-10">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 relative">

                {filteredMessages?.length === 0 && searchQuery.trim() ? (
                    <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-gray-400 mb-2">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No messages found</h3>
                                <p className="text-gray-500 text-sm">
                                    No messages match your search for "{searchQuery}". Try adjusting your search terms.
                                </p>
                            </div>
                        </td>
                    </tr>
                ) : filteredMessages?.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-gray-400 mb-2">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No messages yet</h3>
                                <p className="text-gray-500 text-sm">
                                    Start sending messages to see them appear here.
                                </p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    filteredMessages?.map(userMsg => {
                        const contactName = currentUser?.user?.first_name + " " + currentUser?.user?.last_name;
                        const contactPhone = currentUser?.user?.phone;
                        const messageText = userMsg?.chat?.at(userMsg?.chat?.length - 1)?.content;
                        const messageDate = userMsg?.chat?.at(userMsg?.chat?.length - 1)?.updated_at?.split("T")?.at(0);
                        const messageTimeStamp = userMsg?.chat?.at(userMsg?.chat?.length - 1)?.updated_at?.split("T")?.at(1)?.slice(0, 8);
                        const messageStatus = userMsg?.chat?.at(userMsg?.chat?.length - 1)?.status;
                        return (
                            <Fragment key={userMsg}>
                                <FullMessageOverview
                                    key={userMsg}
                                    contactName={contactName}
                                    contactPhoneNumber={contactPhone}
                                    messageDate={messageDate}
                                    messageTimeStamp={messageTimeStamp}
                                    messageStatus={messageStatus}
                                    messageText={messageText}
                                    deleteMessage={() => {
                                        setSelectedMessageId(userMsg?.id);
                                        console.log(userMsg?.id);
                                        setDeleteMessageDialog(true);
                                    }}
                                    forwardMessage={() => handleMessageForwardDialog()}
                                    isAllChecked={selectedMessagesIDs.includes(userMsg?.id)}
                                    handleCheckBox={() => handleCheckBoxIndividually(userMsg?.id)}
                                />

                                {/* if Delete Icon is pressed, then this would be on top of everything */}
                                {deleteMessageDialog && (
                                    <div className="fixed inset-0 bg-black/40 bg-opacity-20 z-40">
                                        {/* This div is just for dimming the background if delete messages dialog is opened, otherwise the background would be smooth */}
                                    </div>
                                )}
                                {
                                    deleteMessageDialog && selectedMessageId === userMsg.id &&
                                    <div className='fixed top-32 z-50 h-auto right-88 bg-white rounded-2xl border-gray-200 border-1 p-5 w-[550px] shadow-gray-200'>
                                        <DeleteMessageDialog
                                            title={"Delete Message"}
                                            contactName={contactName}
                                            contactPhone={contactPhone}
                                            message={contactPhone}
                                            footer={"Are you sure you want to delete this message? This action cannot be undone"}
                                            closeDeleteDialog={() => setDeleteMessageDialog(false)}
                                            deleteMessageCompletely={() => handleDeleteMessage(selectedMessageId)}
                                        />
                                    </div>
                                }

                                {/* if Forward Icons is pressed, then this would be on top of everything */}

                                {showForwardMessageDialog && (
                                    <div className="fixed inset-0 bg-black/40 bg-opacity-20 z-40">
                                        {/* This div is just for dimming the background if forward messages dialog is opened, otherwise the background would be smooth */}
                                    </div>
                                )}

                                {
                                    showForwardMessageDialog &&
                                    <div className='fixed top-4 z-50 h-auto right-88 bg-white rounded-2xl border-gray-200 border-1 p-5 w-[550px] shadow-gray-200'>
                                        <ForwardMessageDialog
                                            title={"Forward"}
                                            closeForwardDialog={() => setShowForwardMessageDialog(false)}
                                        />
                                    </div>
                                }
                            </Fragment>
                        )
                    })
                )}
            </tbody>
        </table>
    )
}

export default AllMessagesTable