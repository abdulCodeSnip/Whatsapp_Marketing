// Chats.jsx
import React, { useEffect, useState } from "react";
import { MdOutlineWatchLater } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import { useSelector } from "react-redux";
import { BiCheckDouble, BiVideo } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";
import { io } from "socket.io-client";
import SendTemplateMessage from "./SendTemplateMessage";
import PickAndSendFile from "./PickAndSendFile";
import { HiPhoto } from "react-icons/hi2";

let socket;

const Chats = () => {
    const [dynamicChats, setDynamicChats] = useState({ chat: [] });
    const [newMessage, setNewMessage] = useState("");
    const [isMessageSentFailed, setIsMessageSentFailed] = useState(false);

    const allChats = useSelector((state) => state?.dynamicChats?.allChats);
    const user = useSelector((state) => state?.loginUser?.userLogin);
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
    const currentUserToConversate = useSelector((state) => state?.selectedContact?.selectedContact);

    const [showSendMessageViaTemplate, setShowSendMessageViaTemplate] = useState(false);

    useEffect(() => {
        if (allChats?.chat) {
            setDynamicChats(allChats);
        } else {
            setDynamicChats({ chat: [] });
        }
    }, [allChats]);

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
                <div className="flex items-center justify-between gap-4">
                    <PickAndSendFile onFileSent={handleAddMediaMessage} />
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

            {isMessageSentFailed && (
                <div className="fixed z-40 bg-white text-xl top-10 right-10 shadow-xl p-4 rounded-xl rounded-tr-none space-y-3">
                    <div>
                        <h2>Message Failure</h2>
                    </div>
                    <button
                        onClick={() => setShowSendMessageViaTemplate(true)}
                        className="text-sm text-gray-800 cursor-pointer p-2 border border-gray-200 rounded-lg"
                    >
                        Try using templates
                    </button>
                </div>
            )}

            {showSendMessageViaTemplate && (
                <SendTemplateMessage closeTemplateDialog={() => setShowSendMessageViaTemplate(false)} />
            )}
        </>
    );
};

export default Chats;
