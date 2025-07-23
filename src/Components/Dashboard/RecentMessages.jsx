import React, { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import MessageCard from '../messageCard'
import { useSelector } from 'react-redux'

const RecentMessages = () => {

    const authInformation = useSelector((state) => state?.auth?.authInformation.at(0));
    const [currenUserDetail, setCurrentUserDetail] = useState([]);
    const [recentMessages, setRecentMessages] = useState([]);


    const fetchAllMessages = async () => {
        try {
            const apiResponse = await fetch(`${authInformation?.baseURL}/messages/history/12`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token
                }
            });

            const result = await apiResponse.json();
            if (apiResponse.ok) {
                setRecentMessages(result);
                console.log(result);
            } else {
                console.log("You're missing something");
            }
        } catch (error) {
            console.log("Something is wrong !", error);
        }
    }

    const id = recentMessages?.receiver?.id || 12;
    const getUserDetail = async () => {
        try {
            const apiResponse = await fetch(`${authInformation?.baseURL}/users/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token,
                },
            });
            const result = await apiResponse.json();
            if (apiResponse?.ok && apiResponse?.status === 200) {
                setCurrentUserDetail(result);
                console.log(result);
            }
        } catch (error) {
            console.log("Something is wrong with your request", error);
        }
    }

    useEffect(() => {
        fetchAllMessages();
        getUserDetail();
    }, [])


    return (
        <div className="p-5 border-1 border-gray-200 w-full rounded-xl shadow-sm shadow-gray-100 bg-white">
            <h2 className="mb-5 font-semibold text-lg">
                Recent Messages
            </h2>
            <hr className="text-gray-200 mb-5 w-full" />

            {/* First Message */}

            {
                <MessageCard
                    userName={currenUserDetail?.user?.first_name + " " + currenUserDetail?.user?.last_name}
                    userProfileLogo={currenUserDetail?.user?.first_name?.charAt(0)?.toUpperCase() + currenUserDetail?.user?.last_name?.charAt(0)?.toUpperCase()}
                    messageStatus={recentMessages?.chat?.at(recentMessages?.chat?.length - 1)?.status}
                    msgDeliveredTime={(recentMessages?.chat?.at(recentMessages?.chat?.length - 1)?.updated_at)?.split("T")?.at(1)?.split(".").at(0)?.slice(0, 5)}
                    phoneNumber={currenUserDetail?.phone}
                    msgSmallOverview={recentMessages?.chat?.at(recentMessages?.chat?.length - 10)?.content}

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