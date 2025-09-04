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

    // Check if the there is something exists inside the chats of "current user in chat", if not then return an empty array of "chats", 
    // here in this function if the user send a message then the chats array would be dynamically "changed"
    useEffect(() => {
        if (allChats?.chat) {
            setDynamicChats(allChats);
        } else {
            setDynamicChats({ chat: [] });
        }
    }, [allChats]);

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

    // this function will send the message to sockets as well as to whatsapp of the "user with currently opened chat"
    const handleUpdatedMessages = async () => {
        if (!newMessage.trim()) return;

        const newChatMessage = {
            from: "me",
            content: newMessage,
            status: "sent",
        };

        try {
            const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/messages/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authInformation?.token,
                },
                body: JSON.stringify({
                    receiver_id: currentUserToConversate?.id,
                    content: newMessage,
                    sender_id: user?.id,
                }),
            });

            const result = await apiResponse.json();
            if (!apiResponse.status === 201) {
                setIsMessageSentFailed(true);
            }

            await fetch(`${import.meta.env.VITE_API_URL}/webhook/whatsapp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: newMessage,
                    username: `${user.first_name} ${user.last_name}`,
                }),
            });

            setDynamicChats((prev) => ({
                ...prev,
                chat: [...(prev.chat || []), newChatMessage],
            }));

            setNewMessage("");
        } catch (err) {
            console.error("❌ Error sending message:", err);
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

    if (!dynamicChats) return (
        <Spinner size="small" />
    );
    

    return (
        <>
            {/* Chat messages */}

            <div className="h-screen overflow-auto p-5">
                <div className="space-y-5">
                    {dynamicChats?.chat?.map((mychat, index) => {
                        const isFromMe = mychat?.from?.toLowerCase() === "me";
                        const mediaType = mychat?.media_type?.toLowerCase();
                        const messageStatus = mychat?.status;

                        return (
                            <div key={index} className={`flex w-full ${isFromMe ? "justify-end" : "justify-start"} mb-2`}>
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg shadow ${isFromMe ? "bg-green-100 text-right" : "bg-gray-200 text-left"
                                        }`}
                                >
                                    <div className="flex flex-row items-center gap-2">
                                        {mediaType && (
                                            <div className="p-1 border bg-white/20 rounded">
                                                {mediaTypeIcon(mediaType)}
                                            </div>
                                        )}
                                        <p className="text-sm break-words">{mychat?.content?.text?.body || mychat?.content}</p>
                                    </div>
                                    <div className="text-xs flex justify-end items-center gap-1 mt-1 text-gray-600">
                                        <span>
                                            {messageStatus === "sent" ? <BiCheckDouble /> : <MdOutlineWatchLater />}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
                        disabled={newMessage.trim() === ""}
                    >
                        <RiSendPlaneFill size={20} color="white" />
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
