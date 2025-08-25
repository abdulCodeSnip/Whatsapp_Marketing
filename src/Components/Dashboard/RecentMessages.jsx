import React, { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import MessageCard from '../messageCard'
import { useSelector } from 'react-redux'

const RecentMessages = () => {

    const authInformation = useSelector((state) => state?.auth?.authInformation.at(0));
    const [recentMessages, setRecentMessages] = useState([]);



    const fetchAllMessages = async () => {
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/chats`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token
                }
            });

            const result = await apiResponse.json();
            if (apiResponse.ok) {
                setRecentMessages(result);
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    useEffect(() => {
        fetchAllMessages();
    }, [])


    const latestUserConversation = recentMessages?.contacts?.at(recentMessages?.contacts?.length - 1);
    const latestUserConversationLogo = latestUserConversation?.first_name?.at(0)?.toUpperCase() + " " + latestUserConversation?.last_name?.at(0)?.toUpperCase();

    return (
        <div className="p-5 border-1 border-gray-200 w-full rounded-xl shadow-sm shadow-gray-100 bg-white">
            <h2 className="mb-5 font-semibold text-lg">
                Recent Messages
            </h2>
            <hr className="text-gray-200 mb-5 w-full" />

            {/* First Message */}

            {
                <MessageCard
                    userName={latestUserConversation?.first_name + " " + latestUserConversation?.last_name}
                    userProfileLogo={latestUserConversationLogo}
                />
            }


            <Link to={"/messages"}
                className="flex items-center justify-center">
                <div className="flex flex-row items-center justify-center  gap-x-3 p-2">
                    <h2 className="text-green-500 font-medium text-[14px]">View All Messages</h2>
                    <FaArrowRight size={15} color='var(--color-green-500)' />
                </div>
            </Link>
        </div>
    )
}

export default RecentMessages