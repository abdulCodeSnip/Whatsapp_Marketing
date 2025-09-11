import { useDispatch, useSelector } from 'react-redux'
import { changeSelectedContact } from '../../redux/chatHistoryPage/selectedContactConversation';
import useFetchCurrentUserChats from '../../hooks/ChatHistoryHooks/useFetchCurrentUserChats';
import Spinner from "../../Components/Spinner";
import useSelectedContactChats from '../../hooks/ChatHistoryHooks/useSelectedContactChats';

const ConversationSidebar = () => {

    //values from Redux
    const currentUserToConversate = useSelector((state) => state?.selectedContact?.selectedContact);
    const dispatch = useDispatch();

    // This is the custom hook that will return nothing but it will fetch all the chat-history of the selected contact
    const { isLoading: isChatHistoryLoading, isError: chatHistoryError, refetch: refetchChatHistory } = useSelectedContactChats();

    const { isError, isLoading, currentUserChatHistory } = useFetchCurrentUserChats();
    
    // Function to handle contact selection
    const handleContactSelection = (contact) => {
        dispatch(changeSelectedContact(contact));
    };

    return (
        <div className="w-80 h-full bg-white p-2 border-r shadow-xl flex flex-col border-r-gray-200">
            {/* Fixed Header Section */}
            <div className="flex-shrink-0">
                <div className='text-gray-900 font-medium text-lg flex flex-col space-y-3'>
                    <h2>Chats</h2>
                    <span className='text-sm font-normal text-gray-500'>Send and receive messages from your contacts</span>
                </div>
            </div>

            {/* Scrollable Content Section */}
            <div className='flex flex-col items-start flex-1 min-h-0'>
                <div className='overflow-y-auto gap-2 w-full my-5 flex-1'>
                    {/* Loading state for contacts list */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Spinner size="medium" />
                            <p className="text-gray-500 mt-2 text-sm">Loading contacts...</p>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-8 px-4">
                            <div className="text-red-400 mb-2">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <p className="text-red-600 text-sm text-center mb-2">Failed to load contacts</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                            >
                                Retry
                            </button>
                        </div>
                    ) : currentUserChatHistory?.contacts?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 px-4">
                            <div className="text-gray-400 mb-2">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2V10a2 2 0 012-2h2m2-4h6a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-sm text-center">No conversations yet</p>
                            <p className="text-gray-400 text-xs text-center mt-1">Start messaging your contacts</p>
                        </div>
                    ) : (
                        currentUserChatHistory?.contacts?.map((contact, index) => {

                            // Get the username of user to show as profile
                            const username = contact?.first_name?.charAt(0)?.toUpperCase() +
                                contact?.first_name?.slice(1) + " " + contact?.last_name?.charAt(0)?.toUpperCase() +
                                contact?.last_name?.slice(1);

                            // Make the avatar from the "First Letter of First Name", "First Letter of Last Name"
                            const avatarText = contact?.first_name?.charAt(0)?.toUpperCase() +
                                contact?.last_name?.charAt(0)?.toUpperCase();

                            if (!avatarText || !username) return (<Spinner size="small" key={index} />)

                            return (
                                <div onClick={() => handleContactSelection(contact)} key={contact?.id || index} className='flex w-full hover:bg-gray-100 rounded-lg mb-2 relative'>
                                    <div className={`flex flex-row ${currentUserToConversate?.id === contact?.id ? "bg-gray-100 border-l-[4px] rounded-l-none border-l-green-500" : "bg-white"} items-center justify-start w-full gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded-lg`}>
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                            <span>{avatarText}</span>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-gray-900">{username}</span>
                                            <div className="text-xs text-gray-500 truncate">
                                                {contact?.phone && `📱 ${contact.phone}`}
                                            </div>
                                            {/* Show loading indicator when fetching chat history for this contact */}
                                            {isChatHistoryLoading && currentUserToConversate?.id === contact?.id && (
                                                <div className="flex items-center mt-1">
                                                    <Spinner size="small" />
                                                    <span className="text-xs text-gray-500 ml-1">Loading messages...</span>
                                                </div>
                                            )}
                                            {/* Show error if chat history failed to load */}
                                            {chatHistoryError && currentUserToConversate?.id === contact?.id && (
                                                <div className="flex items-center mt-1">
                                                    <span className="text-xs text-red-500">Failed to load messages</span>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleContactSelection(contact);
                                                        }}
                                                        className="text-xs text-green-600 ml-2 underline"
                                                    >
                                                        Retry
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

export default ConversationSidebar