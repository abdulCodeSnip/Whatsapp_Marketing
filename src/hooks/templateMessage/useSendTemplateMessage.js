import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const useSendTemplateMessage = (authInfo) => {
    const [isTemplateMessageSent, setIsTemplateMessageSent] = useState(false);
    const [isTemplateMessageSentErr, setIsTemplateMessageSentErr] = useState(false);
    const [templateMessageSentResponse, setTemplateMessageSentResponse] = useState([]);
    const selectedContacts = useSelector((state) => state.allContacts?.selectedContacts);

    // Send a template message to a specific user.
    const sendTemplateMessage = async (receiverPhone, templateName) => {
        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/messages/send-template-test`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authInfo?.token
                },
                body: JSON.stringify({ 
                    to: receiverPhone, 
                    templateName: templateName 
                })
            });
            const result = await apiResponse.json();
            console.log(result);
            if (apiResponse.status === 200 || apiResponse.status === 201) {
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

    // Send template message to multiple users - Loop through each user individually
    const sendTemplateMessageToMultipleUsers = async (variables, selectedTemplateDetail) => {
        try {
            setIsTemplateMessageSent(false);
            setIsTemplateMessageSentErr(false);
            
            const results = [];
            
            // Loop through each selected contact and send template individually
            for (let i = 0; i < selectedContacts.length; i++) {
                const contact = selectedContacts[i];
                
                try {
                    console.log(`Sending template to contact ${i + 1}/${selectedContacts.length}: ${contact.first_name} ${contact.last_name}`);
                    
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/send-template-test`, {
                        method: "POST",
                        headers: {
                            "Authorization": authInfo?.token,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            to: contact?.phone || contact?.id, // Use phone number as shown in screenshot
                            templateName: selectedTemplateDetail?.name
                        })
                    });
                    
                    const result = await response.json();
                    console.log(`Template sent to ${contact.first_name} ${contact.last_name}:`, result);
                    
                    results.push({
                        contact: contact,
                        success: response.status === 200 || response.status === 201,
                        result: result
                    });
                    
                } catch (contactError) {
                    console.error(`Error sending template to ${contact.first_name} ${contact.last_name}:`, contactError);
                    results.push({
                        contact: contact,
                        success: false,
                        error: contactError.message
                    });
                }
            }
            
            // Check if all messages were sent successfully
            const successCount = results.filter(r => r.success).length;
            const failCount = results.length - successCount;
            
            if (successCount > 0) {
                setIsTemplateMessageSent(true);
                console.log(`Successfully sent ${successCount} template messages`);
            }
            
            if (failCount > 0) {
                setIsTemplateMessageSentErr(true);
                console.log(`Failed to send ${failCount} template messages`);
            }
            
            setTemplateMessageSentResponse({
                totalSent: successCount,
                totalFailed: failCount,
                results: results
            });
            
            return results;
            
        } catch (error) {
            console.error("Error in sendTemplateMessageToMultipleUsers:", error);
            setIsTemplateMessageSentErr(true);
            setTemplateMessageSentResponse({ error: error.message });
            throw error;
        }
    };

    return {
        isTemplateMessageSent, isTemplateMessageSentErr, templateMessageSentResponse, sendTemplateMessage, sendTemplateMessageToMultipleUsers,
    }
}

export default useSendTemplateMessage
