import { useState } from 'react';
import { useSelector } from 'react-redux';

const useSendRawMessage = (authInfo) => {
    const [isRawMessageSending, setIsRawMessageSending] = useState(false);
    const [isRawMessageSent, setIsRawMessageSent] = useState(false);
    const [isRawMessageError, setIsRawMessageError] = useState(false);
    const [rawMessageResponse, setRawMessageResponse] = useState(null);
    
    const selectedContacts = useSelector((state) => state.allContacts?.selectedContacts);
    const messageContent = useSelector((state) => state?.messageContent?.content);

    // Send raw message to a single user
    const sendRawMessageToUser = async (phoneNumber, message) => {
        try {
            setIsRawMessageSending(true);
            setIsRawMessageError(false);
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/send-raw-message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authInfo?.token
                },
                body: JSON.stringify({
                    to: phoneNumber,
                    message: message
                })
            });
            
            const result = await response.json();
            console.log(`Raw message sent to ${phoneNumber}:`, result);
            
            if (response.status === 200 || response.status === 201) {
                setIsRawMessageSent(true);
                setIsRawMessageError(false);
            } else {
                setIsRawMessageSent(false);
                setIsRawMessageError(true);
            }
            
            setRawMessageResponse(result);
            return result;
            
        } catch (error) {
            console.error("Error sending raw message:", error);
            setIsRawMessageError(true);
            setRawMessageResponse({ error: error.message });
            throw error;
        } finally {
            setIsRawMessageSending(false);
        }
    };

    // Send raw message to multiple users in a loop
    const sendRawMessageToMultipleUsers = async (message) => {
        try {
            setIsRawMessageSending(true);
            setIsRawMessageError(false);
            setIsRawMessageSent(false);
            
            const results = [];
            
            // Loop through each selected contact and send raw message individually
            for (let i = 0; i < selectedContacts.length; i++) {
                const contact = selectedContacts[i];
                
                try {
                    console.log(`Sending raw message to contact ${i + 1}/${selectedContacts.length}: ${contact.first_name} ${contact.last_name}`);
                    
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/send-raw-message`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": authInfo?.token
                        },
                        body: JSON.stringify({
                            to: contact?.phone || contact?.id,
                            message: message
                        })
                    });
                    
                    const result = await response.json();
                    console.log(`Raw message sent to ${contact.first_name} ${contact.last_name}:`, result);
                    
                    results.push({
                        contact: contact,
                        success: response.status === 200 || response.status === 201,
                        result: result
                    });
                    
                } catch (contactError) {
                    console.error(`Error sending raw message to ${contact.first_name} ${contact.last_name}:`, contactError);
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
                setIsRawMessageSent(true);
                console.log(`Successfully sent ${successCount} raw messages`);
            }
            
            if (failCount > 0) {
                setIsRawMessageError(true);
                console.log(`Failed to send ${failCount} raw messages`);
            }
            
            setRawMessageResponse({
                totalSent: successCount,
                totalFailed: failCount,
                results: results
            });
            
            return results;
            
        } catch (error) {
            console.error("Error in sendRawMessageToMultipleUsers:", error);
            setIsRawMessageError(true);
            setRawMessageResponse({ error: error.message });
            throw error;
        } finally {
            setIsRawMessageSending(false);
        }
    };

    return {
        isRawMessageSending,
        isRawMessageSent,
        isRawMessageError,
        rawMessageResponse,
        sendRawMessageToUser,
        sendRawMessageToMultipleUsers
    };
};

export default useSendRawMessage;
