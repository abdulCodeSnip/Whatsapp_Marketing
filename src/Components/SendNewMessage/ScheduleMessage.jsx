import React, { useEffect, useState } from 'react'
import CustomToggle from './CustomToggle'
import { CgStopwatch } from 'react-icons/cg';
import { AiOutlineSave } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ScheduleMessage = () => {
    const [scheduled, setScheduled] = useState(false);
    const [saveAsTemplate, setSaveAsTemplate] = useState(false);
    const selectedContacts = useSelector((state) => state?.allContacts?.selectedContacts);

    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const currentDate = new Date();

    // Values from redux
    const authInformation = useSelector((state) => state?.auth?.authInformation[0]);
    const messageContent = useSelector((state) => state?.messageContent?.content);
    console.log(messageContent);
    const navigate = useNavigate();



    useEffect(() => {
        const now = new Date();

        // Time
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        setTime(`${hours}:${minutes}`);

        // Date
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const day = String(now.getDate()).padStart(2, "0");
        setDate(`${year}-${month}-${day}`);
    }, []);

    const scheduledData = `${date.slice(0, 10)}T${time.slice(10)}`
    console.log(scheduledData);


    // send a scheduled message from frontend to backend
    const sendScheduleMessage = async () => {

        const promises = selectedContacts?.map(async (selected) => {
            try {
                const apiResponse = await fetch(`${authInformation?.baseURL}/messages/schedule`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": authInformation?.token
                    },
                    body: JSON.stringify({
                        receiver_id: selected?.id,
                        content: messageContent,
                        scheduled_at: "2025-07-23T", // to UTF
                    })
                });
                if (!apiResponse.ok) {
                    throw new Error(`Failed for user ${selected?.id}`);
                }
                const result = await apiResponse.json();
                console.log(result);
            } catch (error) {
                console.log(error);
            }
        });
        await Promise.all(promises);
    }


    // Send message to users directly from the frontend to backend
    const sendMessageDirectly = async () => {
        const promises = selectedContacts?.map(async (selected) => {
            try {
                const apiResponse = await fetch(`${authInformation?.baseURL}/messages/send`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": authInformation?.token
                    },
                    body: JSON.stringify({
                        receiver_id: selected?.id,
                        content: messageContent,
                    })
                });

                if (!apiResponse.ok) {
                    throw new Error(`Failed for user ${selected?.id}`);
                }

                const result = await apiResponse.json();
                console.log(result);
            } catch (error) {
                console.log(error);
            }
        });
        await Promise.all(promises);
    }

    // fucntion to send all the message to users

    return (
        <div className=' p-5 space-y-3'>
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
            {
                scheduled && (
                    <div>
                        <div className='flex flex-row items-center justify-between w-full gap-6'>
                            <div className='flex flex-col w-full'>
                                <label htmlFor="pickDate" className='block text-gray-800 text-sm'>Date</label>
                                <input type="date" id='date' value={date} onChange={(e) => setDate(e.target.value)} className='w-full outline-green-500 px-3 py-2 rounded-xl border border-gray-200' />
                            </div>
                            <div className='flex flex-col w-full'>
                                <label htmlFor="pickDate" className='block text-gray-800 text-sm'>Date</label>
                                <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className='w-full outline-green-500 px-3 py-2 rounded-xl border border-gray-200' />
                            </div>
                        </div>
                    </div>
                )
            }
            {
                saveAsTemplate && (
                    <div className='px-5 py-2 space-y-2'>
                        <label htmlFor="templatName" className='text-gray-800 block'>Template Name</label>
                        <div className='flex flex-col'>
                            <input type="text" placeholder='e.g Product Announcement' className='w-full px-3 py-2 rounded-xl border border-gray-200 outline-green-500' />
                            <span className='text-gray-500 text-xs'>This template will be available for future messages</span>
                        </div>
                    </div>
                )
            }
            <div className='flex flex-row items-center justify-end gap-5'>
                <button onClick={() => navigate("/")} className='flex flex-row items-center justify-center px-4 py-2 rounded-lg cursor-pointer border border-gray-200 outline-green-500 bg-gray-50 text-gray-700 hover:opacity-95 shadow-sm'>Cancel</button>
                <button onClick={() => scheduled ? sendScheduleMessage() : sendMessageDirectly()} className='flex flex-row items-center justify-center px-4 py-2 rounded-lg cursor-pointer border border-gray-200 outline-green-500 bg-green-500 text-white hover:opacity-95 shadow-sm'>Send Message</button>
            </div>
        </div>
    )
}

export default ScheduleMessage