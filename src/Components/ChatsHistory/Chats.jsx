// Chats.jsx
import React, { useEffect, useState, useRef } from "react";
import { MdOutlineWatchLater } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import { useSelector } from "react-redux";
import { BiCheckDouble, BiVideo } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsEmojiSmile } from "react-icons/bs";
import { io } from "socket.io-client";
import SendTemplateMessage from "./SendTemplateMessage";
import PickAndSendFile from "./PickAndSendFile";
import { HiPhoto } from "react-icons/hi2";
import Spinner from "../Spinner";

let socket;

const Chats = () => {
    const [dynamicChats, setDynamicChats] = useState({ chat: [] });
    const [newMessage, setNewMessage] = useState("");
    const [isMessageSentFailed, setIsMessageSentFailed] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [isLoadingChats, setIsLoadingChats] = useState(true);

    // Ref for emoji picker outside click detection
    const emojiPickerRef = useRef(null);

    // Popular emojis for the picker
    const popularEmojis = [
        "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
        "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙",
        "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔",
        "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥",
        "😔", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢",
        "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱",
        "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶",
        "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱",
        "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷",
        "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩",
        "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹",
        "😻", "😼", "😽", "🙀", "😿", "😾", "❤️", "🧡", "💛", "💚",
        "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓",
        "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️",
        "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈", "♉", "♊",
        "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉",
        "👆", "🖕", "👇", "☝️", "👋", "🤚", "🖐️", "✋", "🖖", "👏",
        "🙌", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿"
    ];

    /*
    values from redux, such as 
    => {allChats of current user}, 
    => {currentUser (who is logged in)}, 
    => {authentication (e.g token of current user who is logged in)}, 
    =>  and the {selectedContact from "contacts route to chat with"}
    */
    const allChats = useSelector((state) => state?.dynamicChats?.allChats);
    const user = useSelector((state) => state?.loginUser?.userLogin);
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
    const currentUserToConversate = useSelector((state) => state?.selectedContact?.selectedContact);
    
    // Chat history fetching state
    const [fetchedChatHistory, setFetchedChatHistory] = useState([]);
    const [isFetchingHistory, setIsFetchingHistory] = useState(false);

    // Fetch chat history for the current contact
    const fetchChatHistoryForContact = async (phoneNumber) => {
        if (!phoneNumber || !authInformation?.token) return;
        
        setIsFetchingHistory(true);
        try {
            console.log(`Fetching chat history for: ${phoneNumber}`);
            // remove the "+" from the phone number if it exists
            const phoneNumberWithoutPlus = phoneNumber.replace("+", "");
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/${phoneNumberWithoutPlus}`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation?.token,
                    "Content-Type": "application/json"
                }
            });
            
            const result = await response.json();
            console.log(`Chat history for ${phoneNumber}:`, result);
            
            if (response.status === 200 && Array.isArray(result)) {
                // Convert API response to chat format
                const convertedChats = result.map(message => ({
                    from: message.user_id === user?.id ? "me" : "them", // If message was sent by current user, it's from "me"
                    content: message.content,
                    status: message.status,
                    timestamp: message.created_at,
                    messageType: message.messageable_type, // "Template" or "Raw"
                    id: message.id,
                    number: message.number
                }));
                
                setFetchedChatHistory(convertedChats);
            } else {
                setFetchedChatHistory([]);
            }
            
        } catch (error) {
            console.error("Error fetching chat history:", error);
            setFetchedChatHistory([]);
        } finally {
            setIsFetchingHistory(false);
        }
    };

    // Handle outside click for emoji picker
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

    // Fetch chat history when contact changes
    useEffect(() => {
        if (currentUserToConversate?.phone) {
            fetchChatHistoryForContact(currentUserToConversate.phone);
        } else {
            setFetchedChatHistory([]);
        }
    }, [currentUserToConversate?.phone, currentUserToConversate?.id]);

    // Combine fetched chat history with local chats
    useEffect(() => {
        setIsLoadingChats(true);
        
        // Combine fetched chat history with local chats
        const combinedChats = [...fetchedChatHistory];
        
        if (allChats?.chat) {
            // Add local chats that aren't already in fetched history
            const localChats = allChats.chat.filter(localChat => 
                !fetchedChatHistory.some(fetchedChat => fetchedChat.id === localChat.id)
            );
            combinedChats.push(...localChats);
        }
        
        // Sort by timestamp if available
        combinedChats.sort((a, b) => {
            if (a.timestamp && b.timestamp) {
                return new Date(a.timestamp) - new Date(b.timestamp);
            }
            return 0;
        });
        
        setDynamicChats({ chat: combinedChats });
        
        // Loading delay for smooth UX
        const timeout = setTimeout(() => {
            setIsLoadingChats(false);
        }, 300);
        
        return () => clearTimeout(timeout);
    }, [allChats, fetchedChatHistory]);

    // The connection for sockets to acheive realtime communication, {messages from whatsapp, and then from application to whatsapp} means "bi-directional communication"
    useEffect(() => {
        if (!user?.first_name) return;

        socket = io(import.meta.env.VITE_API_URL, { autoConnect: false });
        socket.auth = { username: `${user.first_name} ${user.last_name}` };
        socket.connect();

        socket.on("connect", () => {
            socket.emit("connectUser", {
                username: `${user.first_name} ${user.last_name}`,
                id: user.id,
            });
        });

        socket.on("recieve-message", (data) => {
            setDynamicChats((prev) => ({
                ...prev,
                chat: [...(prev.chat || []), { from: data.username, content: data.message, status: "received" }],
            }));
        });

        return () => {
            if (socket) socket.disconnect();
        };
    }, [user]);

    // Handle emoji selection
    const handleEmojiSelect = (emoji) => {
        setNewMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    // Handle emoji button click
    const handleEmojiButtonClick = (e) => {
        e.preventDefault();
        setShowEmojiPicker(!showEmojiPicker);
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUpdatedMessages();
        }
    };

    // this function will send the message using the new raw message API
    const handleUpdatedMessages = async () => {
        if (!newMessage.trim() || isSendingMessage) return;

        setIsSendingMessage(true);
        setIsMessageSentFailed(false);

        const newChatMessage = {
            from: "me",
            content: newMessage,
            status: "sending", // Show as sending initially
        };

        // Add the message to UI immediately for better UX
        setDynamicChats((prev) => ({
            ...prev,
            chat: [...(prev.chat || []), newChatMessage],
        }));

        const messageToSend = newMessage;
        setNewMessage(""); // Clear input immediately

         // removing the "+" from the phone number if it exists
         const phoneNumberWithoutPlus = currentUserToConversate?.phone?.replace("+", "") || currentUserToConversate?.id;

        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/messages/send-raw-message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authInformation?.token,
                },
                body: JSON.stringify({
                    to: phoneNumberWithoutPlus,
                    message: messageToSend
                }),
            });

            const result = await apiResponse.json();
            console.log("Raw message sent:", result);
            
            if (apiResponse.status !== 200 && apiResponse.status !== 201) {
                setIsMessageSentFailed(true);
                // Update message status to failed
                setDynamicChats((prev) => ({
                    ...prev,
                    chat: prev.chat.map((msg, index) => 
                        index === prev.chat.length - 1 ? { ...msg, status: "failed" } : msg
                    ),
                }));
                return;
            }

            // Update message status to sent
            setDynamicChats((prev) => ({
                ...prev,
                chat: prev.chat.map((msg, index) => 
                    index === prev.chat.length - 1 ? { ...msg, status: "sent" } : msg
                ),
            }));

        } catch (err) {
            console.error("❌ Error sending raw message:", err);
            setIsMessageSentFailed(true);
            
            // Update message status to failed
            setDynamicChats((prev) => ({
                ...prev,
                chat: prev.chat.map((msg, index) => 
                    index === prev.chat.length - 1 ? { ...msg, status: "failed" } : msg
                ),
            }));
        } finally {
            setIsSendingMessage(false);
        }
    };

    // This function will only return the icon for a particular media type. because we havent store the data into a cloud services that's why only "icons" would be shown here, instead of "real image or real video"
    const mediaTypeIcon = (mediaType) => {
        switch (mediaType) {
            case "document":
                return <TiDocumentText color="red" size={28} />;
            case "image":
                return <HiPhoto color="green" size={28} />;
            case "video":
                return <BiVideo color="green" size={28} />;
            default:
                return null;
        }
    };

    // this function will set the media type and the file name of "just picked file" to send to server
    const handleAddMediaMessage = (mediaType, fileName) => {
        const newMediaMessage = {
            from: "me",
            media_type: mediaType,
            content: fileName,
            status: "sent",
        };

        setDynamicChats((prev) => ({
            ...prev,
            chat: [...(prev.chat || []), newMediaMessage],
        }));
    };

    // Retry sending a failed message
    const handleRetryMessage = async (messageIndex) => {
        const messageToRetry = dynamicChats.chat[messageIndex];
        if (!messageToRetry || messageToRetry.status !== "failed") return;

        // Update message status to sending
        setDynamicChats((prev) => ({
            ...prev,
            chat: prev.chat.map((msg, index) => 
                index === messageIndex ? { ...msg, status: "sending" } : msg
            ),
        }));

        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/messages/send-raw-message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authInformation?.token,
                },
                body: JSON.stringify({
                    to: currentUserToConversate?.phone?.replace("+", "") || currentUserToConversate?.id,
                    message: messageToRetry.content
                }),
            });

            if (apiResponse.status === 200 || apiResponse.status === 201) {
                // Update message status to sent
                setDynamicChats((prev) => ({
                    ...prev,
                    chat: prev.chat.map((msg, index) => 
                        index === messageIndex ? { ...msg, status: "sent" } : msg
                    ),
                }));
            } else {
                throw new Error("Failed to send message");
            }
        } catch (error) {
            console.error("❌ Error retrying message:", error);
            // Update message status back to failed
            setDynamicChats((prev) => ({
                ...prev,
                chat: prev.chat.map((msg, index) => 
                    index === messageIndex ? { ...msg, status: "failed" } : msg
                ),
            }));
        }
    };

    // Show loading state when chats are loading or fetching history
    if (isLoadingChats || isFetchingHistory) {
        return (
            <>
                {/* Chat messages container with loading */}
                <div className="h-screen overflow-auto p-5 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <Spinner size="large" />
                        <p className="text-gray-500 mt-4 text-sm">
                            {isFetchingHistory ? "Loading chat history..." : "Loading conversation..."}
                        </p>
                    </div>
                </div>

                {/* Footer input - keep it visible even during loading */}
                <div className="border-t border-gray-200 bg-white shadow-md p-4 sticky bottom-0 w-full">
                    <div className="flex items-center justify-between gap-4 relative">
                        <PickAndSendFile onFileSent={handleAddMediaMessage} />
                        
                        {/* Message input container */}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                                disabled={isFetchingHistory}
                            />
                            
                            {/* Emoji button */}
                            <button
                                onClick={handleEmojiButtonClick}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                type="button"
                                disabled={isFetchingHistory}
                            >
                                <BsEmojiSmile size={20} className="text-gray-500 hover:text-gray-700" />
                            </button>
                        </div>

                        {/* Send button */}
                        <button
                            onClick={handleUpdatedMessages}
                            className="ml-2 flex items-center cursor-pointer justify-center bg-green-500 hover:bg-green-600 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={newMessage.trim() === "" || isSendingMessage || isFetchingHistory}
                        >
                            {isSendingMessage ? (
                                <Spinner size="small" />
                            ) : (
                                <RiSendPlaneFill size={20} color="white" />
                            )}
                        </button>
                    </div>
                </div>
            </>
        );
    }
    

    return (
        <>
            {/* Chat messages */}

            <div className="h-screen overflow-auto p-5">
                <div className="space-y-5">
                    {dynamicChats?.chat?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-20">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                            <p className="text-gray-500 text-sm text-center">
                                Start a conversation by sending a message below
                            </p>
                        </div>
                    ) : (
                        dynamicChats?.chat?.map((mychat, index) => {
                        const isFromMe = mychat?.from?.toLowerCase() === "me";
                        const mediaType = mychat?.media_type?.toLowerCase();
                        const messageStatus = mychat?.status;
                        const messageType = mychat?.messageType;
                        const timestamp = mychat?.timestamp;

                        return (
                            <div key={mychat?.id || index} className={`flex w-full ${isFromMe ? "justify-end" : "justify-start"} mb-2`}>
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg shadow ${isFromMe ? "bg-green-100 text-right" : "bg-gray-200 text-left"
                                        }`}
                                >
                                    {/* Message Type Badge */}
                                    {messageType && (
                                        <div className="mb-1">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                messageType === 'Template' 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {messageType === 'Template' ? '📋 Template' : '💬 Message'}
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className="flex flex-row items-center gap-2">
                                        {mediaType && (
                                            <div className="p-1 border bg-white/20 rounded">
                                                {mediaTypeIcon(mediaType)}
                                            </div>
                                        )}
                                        <p className="text-sm break-words">{mychat?.content?.text?.body || mychat?.content}</p>
                                    </div>
                                    
                                    <div className="text-xs flex justify-between items-center gap-1 mt-1 text-gray-600">
                                        {/* Timestamp */}
                                        {timestamp && (
                                            <span className="text-xs text-gray-500">
                                                {new Date(timestamp).toLocaleTimeString([], { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </span>
                                        )}
                                        
                                        {/* Status */}
                                        <span>
                                            {messageStatus === "sent" ? (
                                                <BiCheckDouble className="text-green-500" />
                                            ) : messageStatus === "sending" ? (
                                                <div className="flex items-center gap-1">
                                                    <Spinner size="small" />
                                                    <span className="text-xs">Sending...</span>
                                                </div>
                                            ) : messageStatus === "failed" ? (
                                                <div className="flex items-center gap-1 text-red-500">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-xs">Failed</span>
                                                    <button
                                                        onClick={() => handleRetryMessage(index)}
                                                        className="ml-1 text-xs underline hover:text-red-700"
                                                        title="Retry sending message"
                                                    >
                                                        Retry
                                                    </button>
                                                </div>
                                            ) : (
                                                <MdOutlineWatchLater />
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                        })
                    )}
                </div>
            </div>

            {/* Footer input */}
            <div className="border-t border-gray-200 bg-white shadow-md p-4 sticky bottom-0 w-full">
                <div className="flex items-center justify-between gap-4 relative">
                    <PickAndSendFile onFileSent={handleAddMediaMessage} />
                    
                    {/* Message input container */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                        
                        {/* Emoji button */}
                        <button
                            onClick={handleEmojiButtonClick}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            type="button"
                        >
                            <BsEmojiSmile size={20} className="text-gray-500 hover:text-gray-700" />
                        </button>
                    </div>

                    {/* Send button */}
                    <button
                        onClick={handleUpdatedMessages}
                        className="ml-2 flex items-center cursor-pointer justify-center bg-green-500 hover:bg-green-600 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={newMessage.trim() === "" || isSendingMessage}
                    >
                        {isSendingMessage ? (
                            <Spinner size="small" />
                        ) : (
                            <RiSendPlaneFill size={20} color="white" />
                        )}
                    </button>

                    {/* Emoji Picker Modal */}
                    {showEmojiPicker && (
                        <div 
                            ref={emojiPickerRef}
                            className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-80 max-h-64 overflow-y-auto"
                        >
                            <div className="p-3">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-gray-700">Choose an emoji</h3>
                                    <button
                                        onClick={() => setShowEmojiPicker(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-10 gap-1">
                                    {popularEmojis.map((emoji, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleEmojiSelect(emoji)}
                                            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
                                            title={`Add ${emoji}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                
                                {/* Recently used section (placeholder for future enhancement) */}
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 text-center">
                                        Click an emoji to add it to your message
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Chats;
