import React, { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import MessageCard from '../messageCard'
import { useSelector } from 'react-redux'
import Spinner from '../Spinner'

const RecentMessages = () => {

    const authInformation = useSelector((state) => state?.auth?.authInformation.at(0));
    const [recentMessages, setRecentMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllMessages = async () => {
        try {
            setIsLoading(true);
            setError(null);

            if (!authInformation?.token) {
                throw new Error('No authentication token available');
            }

            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/chats`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token
                }
            });

            if (!apiResponse.ok) {
                throw new Error(`Failed to fetch messages: ${apiResponse.status}`);
            }

            const result = await apiResponse.json();
            setRecentMessages(result || {});
        } catch (error) {
            console.error("Error fetching recent messages:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (authInformation?.token) {
            fetchAllMessages();
        } else {
            setIsLoading(false);
        }
    }, [authInformation?.token]);

    // Safely get the latest conversation with fallbacks
    const getLatestConversation = () => {
        const contacts = recentMessages?.contacts;
        if (!Array.isArray(contacts) || contacts.length === 0) {
            return null;
        }
        return contacts[contacts.length - 1];
    };

    const latestUserConversation = getLatestConversation();

    // Safely create user logo with fallbacks
    const getUserLogo = (user) => {
        if (!user || !user.first_name || !user.last_name) {
            return "NA";
        }
        const firstInitial = user.first_name.charAt(0)?.toUpperCase() || "";
        const lastInitial = user.last_name.charAt(0)?.toUpperCase() || "";
        return `${firstInitial}${lastInitial}`; // Remove space between initials
    };

    // Safely get user name with fallbacks
    const getUserName = (user) => {
        if (!user) return "Unknown User";
        const firstName = user.first_name || "";
        const lastName = user.last_name || "";
        return `${firstName} ${lastName}`.trim() || "Unknown User";
    };

    return (
        <div className="p-5 border-1 border-gray-200 w-full rounded-xl shadow-sm shadow-gray-100 bg-white">
            <h2 className="mb-5 font-semibold text-lg">
                Recent Messages
            </h2>
            <hr className="text-gray-200 mb-5 w-full" />

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-3">
                        <Spinner size="medium" />
                        <span className="text-gray-500 text-sm">Loading recent messages...</span>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <div className="text-red-500 mb-2">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">Failed to load messages</h3>
                        <p className="text-xs text-gray-500 mb-3">{error}</p>
                        <button
                            onClick={fetchAllMessages}
                            className="text-green-500 hover:text-green-600 text-xs font-medium underline"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            )}

            {/* No Messages State */}
            {!isLoading && !error && !latestUserConversation && (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <div className="text-gray-400 mb-2">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">No recent messages</h3>
                        <p className="text-xs text-gray-500">Start a conversation to see messages here</p>
                    </div>
                </div>
            )}

            {/* Message Card - Only show if we have data */}
            {!isLoading && !error && latestUserConversation && (
                <MessageCard
                    userName={getUserName(latestUserConversation)}
                    userProfileLogo={getUserLogo(latestUserConversation)}
                    phoneNumber={latestUserConversation?.phone || "No phone number"}
                    messageStatus="Delivered" // Default status since it's not in the API response
                    msgDeliveredTime="Just now" // Default time since it's not in the API response
                    msgSmallOverview="Recent conversation" // Default message since it's not in the API response
                />
            )}

            {/* View All Messages Link */}
            <Link to={"/messages"}
                className="flex items-center justify-center mt-4">
                <div className="flex flex-row items-center justify-center gap-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <h2 className="text-green-500 font-medium text-[14px]">View All Messages</h2>
                    <FaArrowRight size={15} color='var(--color-green-500)' />
                </div>
            </Link>
        </div>
    )
}

export default RecentMessages