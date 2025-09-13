import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import useSendTemplateMessage from '../../hooks/templateMessage/useSendTemplateMessage';

const ReceiverHeader = ({ selectedContact }) => {

    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
    const [successfullySentTemplate, setSuccessfullySentTemplate] = useState(false);

    // Use the passed selectedContact prop directly instead of making API calls


    // A custom hook that would be responsible for sending a default templates
    const { isTemplateMessageSent, isTemplateMessageSentErr, sendTemplateMessage, templateMessageSentResponse } = useSendTemplateMessage(authInformation);
    useEffect(() => {
        setSuccessfullySentTemplate(isTemplateMessageSent);
    }, [isTemplateMessageSent]);

    if (successfullySentTemplate) {
        setTimeout(() => {
            setSuccessfullySentTemplate(false);
        }, 4000);
    }

    // Create avatar from the selected contact data
    const selectedContactLOGO = selectedContact?.first_name?.charAt(0)?.toUpperCase() + 
        selectedContact?.last_name?.charAt(0)?.toUpperCase();
    return (
        <>
            {/* Check if there is any selected Contact, then show the detail of that "contact" */}
            {selectedContact &&
                (
                    <header className='w-full h-20 items-center flex flex-row p-4 shadow-sm justify-between bg-white'>

                        {/* User Logo "Default", with just "username and phone number" */}
                        <div className='flex flex-row gap-x-2'>
                            <div>
                                <h2 className='h-[50px] w-[50px] flex items-center rounded-full bg-green-100 text-green-700 justify-center font-medium'>
                                    {selectedContactLOGO}
                                </h2>
                            </div>
                            <div>
                                <h2 className='font-medium text-gray-900'>
                                    {selectedContact?.first_name + " " + selectedContact?.last_name}
                                </h2>
                                <span className='text-gray-500 text-sm'>{selectedContact?.phone}</span>
                            </div>
                        </div>

                        {/* A Default Template, that would be sent to the user immediately for better communication, {and allow, whatsapp, to know the system is verified} */}
                        <button
                            onClick={() => sendTemplateMessage(selectedContact?.phone?.replace("+", ""), "hello_world")}
                            className='text-gray-800 border-1 px-3 py-2 cursor-pointer border-gray-200 rounded-lg'>
                            Send Template
                        </button>

                    </header>
                )
            }
            {successfullySentTemplate && (
                <div className='fixed top-15 z-50 bg-green-100 px-3 py-2 rounded-lg text-green-800 text-sm right-20 shadow-lg'>
                    <span>Tempate Sent successfully</span>
                </div>
            )}
        </>
    )
}

export default ReceiverHeader