import React, { useEffect, useState } from "react";
import { MdOutlineEmojiEmotions, MdOutlineWatchLater } from "react-icons/md";
import { useSelector } from "react-redux";
import { BiCheckDouble } from "react-icons/bi";
import { FiPaperclip } from "react-icons/fi";
import { RiSendPlaneFill } from "react-icons/ri";
import { Link } from "react-router-dom"
import { io } from "socket.io-client";
import SendTemplateMessage from "./SendTemplateMessage";

let socket;

const Chats = () => {
    const [dynamicChats, setDynamicChats] = useState({ chat: [] });
    const [newMessage, setNewMessage] = useState("");
    const [isMessageSentFailed, setIsMessageSentFailed] = useState(false);

    // Redux values
    const allChats = useSelector((state) => state?.dynamicChats?.allChats);
    const user = useSelector((state) => state?.loginUser?.userLogin);
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
    const currentUserToConversate = useSelector((state) => state?.selectedContact?.selectedContact);

    const [showSendMessageViaTemplate, setShowSendMessageViaTemplate] = useState(false);

    // Load existing chats
    useEffect(() => {
        if (allChats?.chat) {
            setDynamicChats(allChats);
        } else {
            setDynamicChats({ chat: [] });
        }
    }, [allChats]);

    // Setup socket for realtime communication with backend
    useEffect(() => {
        if (!user?.first_name) return;

        socket = io(import.meta.env.VITE_API_URL, { autoConnect: false });
        socket.auth = { username: `${user.first_name} ${user.last_name}` };
        socket.connect();

        socket.on("connect", () => {
            // same as HTML: connectUser event
            socket.emit("connectUser", {
                username: `${user.first_name} ${user.last_name}`,
                id: user.id,
            });
            console.log("✅ Connected:", socket.id);
        });

        // Listen incoming
        socket.on("recieve-message", (data) => {
            console.log("📥 Incoming:", data);
            setDynamicChats((prev) => ({
                ...prev,
                chat: [...(prev.chat || []), { from: data.username, content: data.message, status: "received" }],
            }));
        });

        return () => {
            if (socket) socket.disconnect();
        };
    }, [user]);

    // Send message (exact same as HTML → uses fetch)
    const handleUpdatedMessages = async () => {
        if (!newMessage.trim()) return;

        const newChatMessage = {
            from: "me",
            content: newMessage,
            status: "sent",
        };

        try {
            // 1️⃣ Save & forward via API (your DB + WhatsApp)
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

            // 2️⃣ Same as HTML → also hit webhook/whatsapp
            await fetch(`${import.meta.env.VITE_API_URL}/webhook/whatsapp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: newMessage,
                    username: `${user.first_name} ${user.last_name}`,
                }),
            });

            // 3️⃣ Update UI instantly
            setDynamicChats((prev) => ({
                ...prev,
                chat: [...(prev.chat || []), newChatMessage],
            }));

            setNewMessage("");
        } catch (err) {
            console.error("❌ Error sending message:", err);
        }
    };


    return (
        <>
            {/* Chat messages */}
            <div className="h-screen overflow-auto p-5">
                <div className="space-y-5">
                    {dynamicChats?.chat?.map((mychat, index) => {
                        const isFromMe = mychat?.from?.toLowerCase() === "me";
                        return (
                            <div key={index} className={`flex w-full ${isFromMe ? "justify-end" : "justify-start"} mb-2`}>
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg shadow ${isFromMe ? "bg-green-100 text-right" : "bg-gray-200 text-left"
                                        }`}
                                >
                                    <p className="text-sm">{mychat?.content}</p>
                                    <div className="text-xs flex items-center gap-1 mt-1 text-gray-600">
                                        {mychat?.status === "sent" ? <BiCheckDouble /> : <MdOutlineWatchLater />}
                                        <span>{mychat?.status}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer input */}
            <div className="border-t border-gray-200 bg-white shadow-md p-4 sticky bottom-0 w-full">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-gray-600">
                        <FiPaperclip size={22} className="cursor-pointer" />
                        <MdOutlineEmojiEmotions size={24} className="cursor-pointer" />
                    </div>

                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    />

                    <button
                        onClick={handleUpdatedMessages}
                        className="ml-2 flex items-center justify-center bg-green-500 rounded-full p-2 disabled:opacity-50"
                        disabled={newMessage.trim() === ""}
                    >
                        <RiSendPlaneFill size={20} color="white" />
                    </button>
                </div>
            </div>

            {/* if normal message cannot be send then try using templates */}
            {isMessageSentFailed &&
                <div className="fixed z-40 bg-white text-xl top-10 right-10 shadow-xl p-4 rounded-xl rounded-tr-none space-y-3">
                    <div>
                        <h2>
                            Message Failure
                        </h2>
                    </div>
                    <button onClick={() => setShowSendMessageViaTemplate(true)} className="text-sm text-gray-800 cursor-pointer p-2 border-1 border-gray-200 rounded-lg">
                        <span>Try using templates</span>
                    </button>
                </div>
            }

            {
                showSendMessageViaTemplate && (
                    <SendTemplateMessage closeTemplateDialog={() => setShowSendMessageViaTemplate(false)}/>
                )
            }

        </>
    );
};

export default Chats;
