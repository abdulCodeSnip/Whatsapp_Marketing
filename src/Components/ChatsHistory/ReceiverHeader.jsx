import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const ReceiverHeader = () => {

    const [userDetail, setUserDetail] = useState([]);

    const selectedContact = useSelector((state) => state?.selectedContact?.selectedContact);
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));

    // Get Complete User Detail

    const getUserDetail = async () => {
        try {
            const apiResponse = await fetch(`${authInformation?.baseURL}/users/${selectedContact?.id}`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token,
                },
            });
            const result = await apiResponse.json();
            if (apiResponse?.ok && apiResponse?.status === 200) {
                setUserDetail(result);
                console.log(result);
            }
        } catch (error) {
            console.log("Something is wrong with your request", error);
        }
    }

    useEffect(() => {
        getUserDetail();
    }, [selectedContact])
    return (
        <>
            {selectedContact.length !== 0 &&
                (<header className='w-full h-20 items-center flex flex-row p-4 shadow-sm justify-between bg-white'>

                    {/* User Logo "Default" */}
                    <div className='flex flex-row gap-x-2'>
                        <div>
                            <h2 className='h-[50px] w-[50px] flex items-center rounded-full bg-green-100 text-green-700 justify-center font-medium'>{userDetail?.user?.first_name?.charAt(0)?.toUpperCase() + " " + userDetail?.user?.last_name?.charAt(0).toUpperCase()}</h2>
                        </div>

                        <div>
                            <h2 className='font-medium text-gray-900'>{userDetail?.user?.first_name + " " + userDetail?.user?.last_name}</h2>
                            <span className='text-gray-500 text-sm'>{userDetail?.user?.phone}</span>
                        </div>
                    </div>
                </header>)
            }
        </>
    )
}

export default ReceiverHeader