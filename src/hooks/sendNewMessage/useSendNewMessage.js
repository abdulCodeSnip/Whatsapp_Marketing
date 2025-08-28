import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const useSendNewMessage = () => {
    const [isMessageSending, setIsMessageSending] = useState(false);
    const [errorInSendingMessage, setErrorInMessageSending] = useState("");
    const [successMessageOnSent, setSuccessMessageOnSent] = useState("");
    const [isMessageScheduling, setIsMessageScheduling] = useState(false);
    const [scheduleMSG, setScheduleMSG] = useState({ message: "", type: "" });

    // Values from redux, such as "selected contacts" for message to be sent, "authorization token", and "message content"
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
    const selectedContacts = useSelector((state) => state?.allContacts?.selectedContacts);
    const messageContent = useSelector((state) => state?.messageContent?.content);

    // function to send message to selected user, if "currently more users are selected" then "we'll hit the send-bulk-message API"
    const sendMessage = async () => {
        setIsMessageSending(true);

        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/messages/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authInformation?.token
                },
                body: JSON.stringify({
                    receiver_id: selectedContacts?.at(0)?.id,
                    content: messageContent
                })
            });

            const apiResult = await apiResponse.json();
            if (apiResponse?.status === 201) {
                setSuccessMessageOnSent(`Message successfully sent to ${selectedContacts?.at(0)?.first_name + " " + selectedContacts?.at(0)?.last_name}`)
            } else {
                setErrorInMessageSending(`Error! ${apiResult?.message}`)
            }

        } catch (error) {
            setErrorInMessageSending(`Error while sending Message to ${selectedContacts?.at(0)?.id}!`);
        } finally {
            setIsMessageSending(false);
        }
    }

    // If there are multiple users selected for this message to be sent, then this api would be called
    // a variable that'll hold the information about the selected users "phone", "customer_name", "ids"
    const csv_data = selectedContacts && selectedContacts?.map((selected) =>
    ({
        phone: selected?.phone,
        customer_name: selected?.first_name + " " + selected?.last_name,
        user_id: selected?.id
    }));
    
    const sendBulkMessages = async () => {
        setIsMessageSending(true);
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/messages/send-bulk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authInformation?.token,
                },
                body: JSON.stringify({
                    csv_data: csv_data,
                    content: messageContent,
                })
            });

            const apiResult = await apiResponse.json();
            if (apiResponse.ok) {
                setSuccessMessageOnSent(apiResult?.message);
            } else {
                setErrorInMessageSending(`Error in sending bulk messages, ${apiResult?.message}`);
            }
        } catch (error) {
            setErrorInMessageSending(`Error while sending message ${error?.message}`);
            console.log(error)
        } finally {
            setIsMessageSending(false);
        }
    }

    // for all the selected contacts send the schedule messages
    const scheduleMessages = async (messageScheduledTime) => {
        // Input validation
        if (!selectedContacts?.length) {
            setScheduleMSG({ message: "Please select at least one contact", type: "error" });
            return;
        }

        if (!messageContent?.trim()) {
            setScheduleMSG({ message: "Message content cannot be empty", type: "error" });
            return;
        }

        try {
            setIsMessageScheduling(true);
            setScheduleMSG("");

            const promises = selectedContacts.map((contact) =>
                fetch(`${import.meta.env.VITE_API_URL}/messages/schedule`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": authInformation?.token,
                    },
                    body: JSON.stringify({
                        receiver_id: contact?.id,
                        content: messageContent.trim(),
                        scheduled_at: messageScheduledTime,
                    }),
                })
                    .then(async (res) => {
                        const data = await res.json();
                        if (!res.ok) {
                            throw new Error(data?.message || `HTTP ${res.status}: Failed to schedule`);
                        }
                        return {
                            success: true,
                            contact: contact?.id,
                            contactName: contact?.name || contact?.id,
                            data
                        };
                    })
                    .catch((err) => ({
                        success: false,
                        contact: contact?.id,
                        contactName: contact?.name || contact?.id,
                        error: err.message,
                    }))
            );

            const results = await Promise.all(promises);
            const successful = results.filter((r) => r.success);
            const failed = results.filter((r) => !r.success);

            // Provide detailed feedback
            if (failed.length === 0) {
                setScheduleMSG(`All ${successful.length} messages scheduled successfully! 🎉`);
            } else if (successful.length > 0) {
                setScheduleMSG(
                    `${successful.length}/${selectedContacts.length} messages scheduled successfully. ${failed.length} failed.`
                );
                // Log failed contacts for debugging
                console.warn('Failed to schedule for:', failed.map(f => f.contactName));
            } else {
                setScheduleMSG("All messages failed to schedule");
            }

            console.log('Scheduling results:', results);

        } catch (error) {
            console.error("Unexpected error:", error.message);
            setScheduleMSG(error.message || "An unexpected error occurred");
        } finally {
            setIsMessageScheduling(false);
        }
    }

    return {
        scheduleMSG, isMessageScheduling, isMessageSending, errorInSendingMessage, successMessageOnSent, scheduleMessages, sendBulkMessages, sendMessage
    }
}

export default useSendNewMessage
