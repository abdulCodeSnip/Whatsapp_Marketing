import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useSendNewMessage from '../../hooks/sendNewMessage/useSendNewMessage';

const ScheduleMessage = ({messageMode, sendTemplate}) => {
    const [scheduled, setScheduled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessageOnSending, setErrorMessageOnSending] = useState("");

    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    // Values from redux, such as "selected contacts for message being sent"
    const selectedContacts = useSelector((state) => state?.allContacts?.selectedContacts);
    const selectedTemplate = useSelector((state) => state?.selectedTemplate?.selected);

    // An object for navigating the screen to 
    const navigate = useNavigate();

    // handling date for scheduling messages
    useEffect(() => {
        const now = new Date();

        // Time
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        setTime(`${hours}:${minutes}`);

        // Date
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        setDate(`${year}-${month}-${day}`);
    }, []);

    const scheduledDateTime = new Date(`${date}T${time}:00`).toISOString();

    // Custom hook that is responsible for sending, scheduling, sending-bulk messages, with appropiate data
    const { isMessageScheduling, isMessageSending, scheduleMSG, errorInSendingMessage, scheduleMessages, sendBulkMessages, sendMessage, successMessageOnSent } =
        useSendNewMessage(scheduledDateTime);

    /*
    ** Send message from custom hooks, based on conditions, if only one contact is selected, then send a normal message, 
    if multiple contacts, then "send Bulk messages",

    ** Error Handling: if no contact is selected then don't allow the user to send the message and show an error message
    */
   
    const handleSendOrScheduleMessages = async () => {
        // Clear any previous error messages
        setErrorMessageOnSending("");
        
        // Check if contacts are selected
        if (selectedContacts?.length <= 0) {
            setErrorMessageOnSending("Please select at least one contact");
            return;
        }
        
        // Handle template mode
        if (messageMode === 'template') {
            if (!selectedTemplate) {
                setErrorMessageOnSending("Please select a template to send");
                return;
            }
            setLoading(true);
            try {
                await sendTemplate();
                console.log(`Template "${selectedTemplate}" sent to ${selectedContacts.length} contact(s)`);
            } catch (error) {
                setErrorMessageOnSending(`Failed to send template: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }
        // Handle legacy message sending (for backward compatibility)
        else if (selectedContacts?.length === 1 && !scheduled) {
            await sendMessage();
        } else if (selectedContacts?.length > 1 && !scheduled) {
            // Use individual or bulk sending based on toggle
            if (sendIndividually) {
                // Send individual messages to each contact
                for (const contact of selectedContacts) {
                    await sendMessage(contact);
                }
            } else {
                await sendBulkMessages();
            }
        } else if (selectedContacts?.length > 0 && scheduledDateTime && scheduled) {
            await scheduleMessages(scheduledDateTime);
        }
    }

    return (
        <div className='p-5 space-y-3'>
            <div>
                <h2 className='text-gray-800 font-medium text-lg'>Message Options</h2>
            </div>


            {/* if schedule message then show, then allow user to select date and time for sending that scheduled message */}
            {scheduled && (
                <div>
                    <div className='flex flex-row items-center justify-between w-full gap-6'>
                        <div className='flex flex-col w-full'>
                            <label htmlFor="date" className='block text-gray-800 text-sm'>Date</label>
                            <input
                                type="date"
                                id='date'
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className='w-full outline-green-500 px-3 py-2 rounded-xl border border-gray-200'
                                min={new Date().toISOString().split('T')[0]} // Prevent past dates
                            />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor="time" className='block text-gray-800 text-sm'>Time</label>
                            <input
                                type="time"
                                id="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className='w-full outline-green-500 px-3 py-2 rounded-xl border border-gray-200'
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Error message display */}
            {errorMessageOnSending && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {errorMessageOnSending}
                </div>
            )}

            {/* Buttons to either send a message or just move back to the home page */}
            <div className='flex flex-row items-center justify-end gap-5'>
                <button
                    onClick={() => navigate("/")}
                    className='flex flex-row items-center justify-center px-4 py-2 rounded-lg cursor-pointer border border-gray-200 outline-green-500 bg-gray-50 text-gray-700 hover:opacity-95 shadow-sm'
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    onClick={handleSendOrScheduleMessages}
                    disabled={loading || (messageMode === 'template' && !selectedTemplate)}
                    className={`flex flex-row items-center justify-center px-4 py-2 rounded-lg cursor-pointer border border-gray-200 outline-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed bg-green-500 hover:opacity-95 text-white shadow-sm`}
                >
                    {
                        loading ? (
                            "Sending Template..."
                        ) : isMessageScheduling && scheduled ? "Scheduling Message..." : isMessageSending ? "Message Sending..." : scheduled ? "Schedule Message" : "Send Template"}
                </button>
            </div>
        </div>
    )
};

export default ScheduleMessage