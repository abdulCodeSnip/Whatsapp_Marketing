import React, { useState } from 'react'

const useSendTemplateMessage = (authInfo) => {
    const [isTemplateMessageSent, setIsTemplateMessageSent] = useState(false);
    const [isTemplateMessageSentErr, setIsTemplateMessageSentErr] = useState(false);
    const [templateMessageSentResponse, setTemplateMessageSentResponse] = useState([]);

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
    return {
        isTemplateMessageSent, isTemplateMessageSentErr, templateMessageSentResponse, sendTemplateMessage,
    }
}

export default useSendTemplateMessage
