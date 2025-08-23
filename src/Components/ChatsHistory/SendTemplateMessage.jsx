import React, { useState } from 'react'
import useFetchTemplates from '../../hooks/useFetchTemplates'
import { MdClose } from 'react-icons/md'
import useSendTemplateMessage from '../../hooks/templateMessage/useSendTemplateMessage';
import { useSelector } from 'react-redux';

const SendTemplateMessage = ({ closeTemplateDialog }) => {

    const { isError, isLoading, templates } = useFetchTemplates();
    const [selectedTemplateID, setSelectedTemplateID] = useState(null);
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
    const currentUserToConversate = useSelector((state) => state?.selectedContact?.selectedContact);
    const { sendTemplateMessage, isTemplateMessageSent, templateMessageSentResponse, isTemplateMessageSentErr } = useSendTemplateMessage(authInformation);

    return (
        <div className='fixed z-50 w-[400px] top-32 right-88 bg-white rounded-2xl shadow-lg p-5 space-y-2'>
            <div className='flex flex-row gap-4 items-center justify-between'>
                <h2 className='font-medium text-gray-800'>
                    Send Template Message
                </h2>
                <button onClick={closeTemplateDialog} className='cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all'>
                    <MdClose />
                </button>
            </div>

            {templateMessageSentResponse && templateMessageSentResponse?.message && (
                <div>
                    <span className={`text-xs ${templateMessageSentResponse?.message?.startsWith("Template message sent") ? "text-green-500": "text-red-500"}`}>{templateMessageSentResponse?.message}</span>
                </div>
            )}
            <div>
                <h2 className='text-sm font-medium text-gray-700'>
                    Select a template
                </h2>
            </div>
            <select required className='border border-gray-200 rounded-lg p-2 cursor-pointer' onChange={(e) => setSelectedTemplateID(e.target?.value)}>
                <option value="">Select a Template</option>
                {
                    templates?.templates?.map((template) => {
                        return (
                            <option key={template?.id} value={`${template?.id}`}>
                                {template?.name}
                            </option>
                        )
                    })
                }
            </select>


            <div className='my-4 flex flex-row items-center justify-end gap-2'>
                <button onClick={closeTemplateDialog} className="border border-gray-200 p-2 rounded-lg text-gray-800 text-sm bg-gray-50 cursor-pointer">
                    Cancel
                </button>
                <button
                    disabled={!selectedTemplateID}
                    onClick={() => {
                        console.log(isTemplateMessageSent);
                        sendTemplateMessage(currentUserToConversate?.id, selectedTemplateID);
                        isTemplateMessageSent ? closeTemplateDialog() : null;
                        setTimeout(() => {
                            closeTemplateDialog();
                        }, 4000);
                    }} className="border disabled:opacity-90 disabled:cursor-not-allowed border-gray-200 p-2 rounded-lg text-gray-100 text-sm bg-green-500 cursor-pointer">
                    Send Template Message
                </button>
            </div>
        </div>
    )
}

export default SendTemplateMessage
