import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const useSendTemplateMessage = (authInfo) => {
    const [isTemplateMessageSent, setIsTemplateMessageSent] = useState(false);
    const [isTemplateMessageSentErr, setIsTemplateMessageSentErr] = useState(false);
    const [templateMessageSentResponse, setTemplateMessageSentResponse] = useState([]);
    const selectedContacts = useSelector((state) => state.allContacts?.selectedContacts);

    // Send a template message to a specific user.
    const sendTemplateMessage = async (recieverID, templateID) => {
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/messages/send-template`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authInfo?.token
                },
                body: JSON.stringify({ receiver_id: recieverID, template_id: templateID })
            });
            const result = await apiResponse.json();
            console.log(result);
            if (apiResponse.status === 201) {
                setIsTemplateMessageSent(true);
                setIsTemplateMessageSentErr(false);
            } else {
                setIsTemplateMessageSent(false);
                setIsTemplateMessageSentErr(true);
            }
            setTemplateMessageSentResponse(result);
        } catch (error) {
            console.log("Error at sending TemplateMessage", error.message);
            setIsTemplateMessageSentErr(true);
        }
    }

    // Send template message to multiple users
    const sendTemplateMessageToMultipleUsers = async (variables, selectedTemplateDetail) => {
        try {
            const promises = selectedContacts?.map(async (selected) => {
                return await fetch(`${import.meta.env.VITE_API_URL}/messages/send-template`, {
                    method: "POST",
                    headers: {
                        "Authorization": authInfo?.token,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        receiver_id: selected?.id,
                        template_id: selectedTemplateDetail?.id,
                        variables: variables
                    })
                })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        return data;
                    });
            });

            await Promise.all(promises);
        } catch (error) {
            console.error("Error sending messages:", error);
            throw error;
        }
    };

    return {
        isTemplateMessageSent, isTemplateMessageSentErr, templateMessageSentResponse, sendTemplateMessage, sendTemplateMessageToMultipleUsers,
    }
}

export default useSendTemplateMessage
