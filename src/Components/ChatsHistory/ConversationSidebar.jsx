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
    useSelectedContactChats();

    const { isError, isLoading, currentUserChatHistory } = useFetchCurrentUserChats();

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
                    {
                        currentUserChatHistory?.contacts?.map((contact, index) => {

                            // Get the username of user to show as profile
                            const username = contact?.first_name?.charAt(0)?.toUpperCase() +
                                contact?.first_name?.slice(1) + " " + contact?.last_name?.charAt(0)?.toUpperCase() +
                                contact?.last_name?.slice(1);

                            // Make the avatar from the "First Letter of First Name", "First Letter of Last Name"
                            const avatarText = contact?.first_name?.charAt(0)?.toUpperCase() +
                                contact?.last_name?.charAt(0)?.toUpperCase();

                            if (!avatarText || !username) return (<Spinner size="small" />)

                            return (
                                <div onClick={() => dispatch(changeSelectedContact(contact))} key={contact?.id || index} className='flex w-full hover:bg-gray-100 rounded-lg mb-2'>
                                    <div className={`flex flex-row ${currentUserToConversate?.id === contact?.id ? "bg-gray-100 border-l-[4px] rounded-l-none border-l-green-500" : "bg-white"} items-center justify-start w-full gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded-lg`}>
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                            <span>{avatarText}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">{username}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default ConversationSidebar