import { template } from 'lodash';
import React, { useEffect, useState } from 'react'
import { FaListUl } from 'react-icons/fa';
import { GoBold } from 'react-icons/go';
import { IoNewspaperOutline } from 'react-icons/io5'
import { MdOutlineEmojiEmotions, MdOutlineFormatListNumbered, MdOutlineFormatUnderlined } from 'react-icons/md';
import { RiItalic, RiLink } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import MediaAttatchments from './MediaAttatchments';
import { contentOfMessage } from '../../redux/sendNewMessage/sendMessage';

const MessageContent = () => {

    // get templates from API
    const [templates, setTemplates] = useState([]);
    const authInformation = useSelector((state) => state?.auth?.authInformation);
    const messageContent = useSelector((state) => state?.messageContent?.content);

    const dispatch = useDispatch();

    const [textareaLength, setTextAreaLength] = useState("");

    const getAllTemplates = async () => {
        try {
            const apiResponse = await fetch(`${authInformation[0].baseURL}/templates`, {
                method: "GET",
                headers: {
                    "Authorization": authInformation[0].token
                }
            });
            const result = await apiResponse.json();
            setTemplates(result?.templates);
        } catch (error) {
            console.log("Something went wrong at the backend !" + error);
        }
    }

    useEffect(() => {
        getAllTemplates();
    }, [])


    return (
        <div>
            {/* Message content with content and a template button */}
            <div className='p-4 space-y-4'>
                <div className='flex flex-row items-center justify-between gap-4'>

                    <div className='text-lg text-gray-800 font-medium py-2'>
                        <h2>Message Content</h2>
                    </div>
                    <div className='flex flex-row rounded-lg border items-center justify-center border-gray-300 shadow-sm px-3 py-2'>
                        <select name="selectTemplate" id="selectTemplate" className='outline-none'>
                            <option value="">Select Template</option>
                            {
                                templates.map((template, index) => (
                                    <option key={index} value={template?.name}>
                                        {template?.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                {/* Options for selecting emojis, and also for selecting lists and "variables" */}
                <div className='flex flex-row gap-4 rounded-xl divide-x divide-gray-200 border border-gray-300 shadow-sm p-2'>
                    <div className="flex flex-row items-center justify-center gap-2">
                        <div className="text-gray-500 hover:text-green-400 hover:bg-gray-100 p-2 cursor-pointer rounded-lg">
                            <GoBold />
                        </div>
                        <div className="text-gray-500 hover:text-green-400 hover:bg-gray-100 p-2 cursor-pointer rounded-lg">
                            <RiItalic />
                        </div>

                        <div className="text-gray-500 hover:text-green-400 hover:bg-gray-100 p-2 cursor-pointer rounded-lg">
                            <MdOutlineFormatUnderlined />
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-center gap-2">
                        <div className="text-gray-500 hover:text-green-400 hover:bg-gray-100 p-2 cursor-pointer rounded-lg">
                            <FaListUl />
                        </div>
                        <div className="text-gray-500 hover:text-green-400 hover:bg-gray-100 p-2 cursor-pointer rounded-lg">
                            <MdOutlineFormatListNumbered />
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-center gap-2">
                        <div className="text-gray-500 hover:text-green-400 hover:bg-gray-100 p-2 cursor-pointer rounded-lg">
                            <RiLink />
                        </div>
                        <div className="text-gray-500 hover:text-green-400 hover:bg-gray-100 p-2 cursor-pointer rounded-lg">
                            <MdOutlineEmojiEmotions />
                        </div>
                    </div>

                </div>

                {/* Content of the Message, which can contain variables and also can contain emojis */}
                <div className='rounded-lg  '>
                    <div>
                        <textarea value={messageContent} onChange={(e) => {
                            setTextAreaLength(e.target.value);
                            dispatch(contentOfMessage(e.target.value));
                        }} rows={6}
                            className='border-gray-300 border resize-none p-4 w-full outline-green-500 rounded-lg' maxLength={1000} />
                    </div>

                    <div className='flex flex-row items-center justify-between p-2'>
                        {/* Common Variables */}
                        <div>
                            <span className='text-xs text-gray-500'>Variables: {"{{name}}"}, {"{{order_number}}"}, {"{{date}}"}</span>
                        </div>

                        {/* Length of the textarea */}
                        <div>
                            <span className='text-gray-500 text-xs'>{textareaLength.length} / {1000} characters</span>
                        </div>
                    </div>
                </div>

                <MediaAttatchments />
            </div>
        </div>
    )
}

export default MessageContent