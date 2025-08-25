import React, { useEffect, useState } from 'react'
import CustomToggle from './CustomToggle'
import { CgStopwatch } from 'react-icons/cg';
import { AiOutlineSave } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { errorOrSuccessMessage } from '../../redux/sendNewMessage/errorMessage';

const ScheduleMessage = () => {
    const [scheduled, setScheduled] = useState(false);
    const [saveAsTemplate, setSaveAsTemplate] = useState(false);
    const [loading, setLoading] = useState(false);

    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    // Values from redux
    const authInformation = useSelector((state) => state?.auth?.authInformation[0]);
    const selectedContacts = useSelector((state) => state?.allContacts?.selectedContacts);
    const messageContent = useSelector((state) => state?.messageContent?.content);
    const errorOrSuccessMsg = useSelector((state) => state?.errorOrSuccessMessage?.errorMessage);
    const dispatch = useDispatch();

    const navigate = useNavigate();

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

    const fetchAllContacts = async () => {
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/contacts`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token // Added Bearer prefix
                }
            });

            if (!apiResponse.ok) {
                throw new Error(`HTTP error! status: ${apiResponse.status}`);
            }

            const result = await apiResponse.json();
            console.log("Contacts fetched:", result);
        } catch (error) {
            console.error("Error fetching contacts:", error);
            dispatch(errorOrSuccessMessage({
                message: "Failed to fetch contacts",
                type: "Error"
            }));
        }
    }

    useEffect(() => {
        if (authInformation?.token) {
            fetchAllContacts();
        }
    }, [authInformation?.token]) // Added dependency

    // Send a scheduled message from frontend to backend
    const sendScheduleMessage = async () => {
        try {
            setLoading(true);

            const promises = selectedContacts?.map(async (selected) => {
                try {
                    // Format the datetime properly for ISO string
                    const scheduledDateTime = new Date(`${date}T${time}:00`).toISOString();

                    const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/messages/schedule`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": authInformation?.token
                        },
                        body: JSON.stringify({
                            receiver_id: selected?.id,
                            content: messageContent,
                            scheduled_at: scheduledDateTime,
                        })
                    });

                    if (!apiResponse.ok) {
                        const errorData = await apiResponse.json().catch(() => ({}));
                        throw new Error(`Failed for user ${selected?.id}: ${errorData.message || apiResponse.status}`);
                    }

                    const result = await apiResponse.json();
                    console.log(`Scheduled message for ${selected?.id}: `, result);
                    return result;
                } catch (error) {
                    console.error(`Error scheduling message for ${selected?.id}: `, error);
                    throw error;
                }
            });

            await Promise.all(promises);
            dispatch(errorOrSuccessMessage({
                message: "Messages scheduled successfully",
                type: "Success"
            }));

        } catch (error) {
            console.error("Error scheduling messages:", error);
            dispatch(errorOrSuccessMessage({
                message: "Failed to schedule messages",
                type: "Error"
            }));
        } finally {
            setLoading(false);
        }
    }

    // Send message to users directly from the frontend to backend, "Need USER_IDs of users"
    const sendMessageDirectly = async () => {
        try {
            setLoading(true);

            const formattedData = selectedContacts?.map((contact) => ({
                phone: contact?.phone,
                customer_name: `${contact?.first_name || ''} ${contact?.last_name || ''} `.trim()
            }));

            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/messages/send-bulk`, {
                method: "POST",
                headers: {
                    "Authorization": authInformation?.token, // Added Bearer prefix
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    csv_data: formattedData,
                    content: messageContent
                })
            });

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json().catch(() => ({}));
                throw new Error(`HTTP error! status: ${apiResponse.status}, message: ${errorData.message || 'Unknown error'} `);
            }

            const result = await apiResponse.json();
            console.log("Messages sent:", result);

            dispatch(errorOrSuccessMessage({
                message: "Messages sent successfully",
                type: "Success"
            }));

        } catch (error) {
            console.error("Error sending messages:", error);
            dispatch(errorOrSuccessMessage({
                message: `Failed to send messages: ${error.message} `,
                type: "Error"
            }));
        } finally {
            setLoading(false);
        }
    }

    const handleSendOrScheduleMessage = async () => {
        // Clear any previous messages
        dispatch(errorOrSuccessMessage({ message: "", type: "" }));

        // Validation
        if (!messageContent || messageContent.length < 10) {
            dispatch(errorOrSuccessMessage({
                message: "Please Enter at least 10 characters",
                type: "Error"
            }));
            return;
        }

        if (!selectedContacts || selectedContacts.length <= 0) {
            dispatch(errorOrSuccessMessage({
                message: "Please select at least one contact",
                type: "Error"
            }));
            return;
        }

        if (!authInformation?.token) {
            dispatch(errorOrSuccessMessage({
                message: "Authentication token is missing",
                type: "Error"
            }));
            return;
        }

        // Additional validation for scheduled messages
        if (scheduled) {
            if (!date || !time) {
                dispatch(errorOrSuccessMessage({
                    message: "Please select both date and time for scheduled message",
                    type: "Error"
                }));
                return;
            }

            // Check if scheduled time is in the future
            const scheduledDateTime = new Date(`${date}T${time}:00`);
            const now = new Date();

            if (scheduledDateTime <= now) {
                dispatch(errorOrSuccessMessage({
                    message: "Scheduled time must be in the future",
                    type: "Error"
                }));
                return;
            }
        }

        // Execute the appropriate function
        try {
            if (scheduled) {
                await sendScheduleMessage();
            } else {
                await sendMessageDirectly();
            }
        } catch (error) {
            console.error("Error in handleSendOrScheduleMessage:", error);
        }
    }

    return (
        <div className='p-5 space-y-3'>
            <div>
                <h2 className='text-gray-800 font-medium text-lg'>Message Options</h2>
            </div>

            {/* Toggle for message as Scheduled message */}
            <div className='flex flex-row items-center justify-between w-full'>
                <div className='flex flex-row items-center justify-center gap-x-2'>
                    <div className='text-gray-800'>
                        <CgStopwatch size={19} />
                    </div>
                    <h2 className='text-gray-800 text-sm'>
                        Schedule Message
                    </h2>
                </div>
                <div>
                    <CustomToggle checked={scheduled} setChecked={() => setScheduled(!scheduled)} />
                </div>
            </div>

            {/* Toggle for Saving message as templates */}
            <div className='flex flex-row items-center justify-between w-full'>
                <div className='flex flex-row items-center justify-center gap-x-2'>
                    <div className='text-gray-800'>
                        <AiOutlineSave size={19} />
                    </div>
                    <h2 className='text-gray-800 text-sm'>
                        Save as Template
                    </h2>
                </div>
                <div>
                    <CustomToggle checked={saveAsTemplate} setChecked={() => setSaveAsTemplate(!saveAsTemplate)} />
                </div>
            </div>

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

            {saveAsTemplate && (
                <div className='px-5 py-2 space-y-2'>
                    <label htmlFor="templateName" className='text-gray-800 block'>Template Name</label>
                    <div className='flex flex-col'>
                        <input
                            type="text"
                            id="templateName"
                            placeholder='e.g Product Announcement'
                            className='w-full px-3 py-2 rounded-xl border border-gray-200 outline-green-500'
                        />
                        <span className='text-gray-500 text-xs'>This template will be available for future messages</span>
                    </div>
                </div>
            )}

            <div className='flex flex-row items-center justify-end gap-5'>
                <button
                    onClick={() => navigate("/")}
                    className='flex flex-row items-center justify-center px-4 py-2 rounded-lg cursor-pointer border border-gray-200 outline-green-500 bg-gray-50 text-gray-700 hover:opacity-95 shadow-sm'
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    onClick={handleSendOrScheduleMessage}
                    disabled={loading}
                    className={`flex flex - row items - center justify - center px - 4 py - 2 rounded - lg cursor - pointer border border - gray - 200 outline - green - 500 ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-500 hover:opacity-95'
                        } text - white shadow - sm`}
                >
                    {loading ? 'Processing...' : (scheduled ? "Schedule Message" : "Send Message")}
                </button>
            </div>
        </div>
    )
};

export default ScheduleMessage