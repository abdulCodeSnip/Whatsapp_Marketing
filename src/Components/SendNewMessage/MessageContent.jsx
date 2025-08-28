import React, { useEffect, useState, useMemo, useCallback, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MediaAttatchments from './MediaAttatchments';
import { contentOfMessage } from '../../redux/sendNewMessage/sendMessage';
import useFetchTemplates from '../../hooks/useFetchTemplates';
import { onChangeSelectedTemplate } from "../../redux/sendNewMessage/selectedTemplate"
import ScheduleMessage from './ScheduleMessage';
import useSendTemplateMessage from '../../hooks/templateMessage/useSendTemplateMessage';

const MessageContent = () => {
    const [templates, setTemplates] = useState([]);

    // VARIABLE ARRAY STATE - Array of variable objects
    const [variableValues, setVariableValues] = useState([]);

    const messageContent = useSelector((state) => state?.messageContent?.content);
    const selectedTemplate = useSelector((state) => state?.selectedTemplate?.selected);
    const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));

    const { sendTemplateMessageToMultipleUsers } = useSendTemplateMessage(authInformation);

    const dispatch = useDispatch();
    const { isError, isLoading, fetchedTemplates } = useFetchTemplates();

    useEffect(() => {
        if (fetchedTemplates?.templates) {
            setTemplates(fetchedTemplates.templates);
        }
    }, [fetchedTemplates]);

    // Reset variable values when template changes
    useEffect(() => {
        if (selectedTemplate) {
            setVariableValues([]);
        }
    }, [selectedTemplate]);

    // Get a selected template details, so that we can use its variables
    const selectedTemplateDetail = useMemo(() =>
        templates?.find(template => template?.name === selectedTemplate),
        [templates, selectedTemplate]
    );

    // Get the variables in the selected template
    const variablesInSelectedTemplate = useMemo(() =>
        selectedTemplateDetail?.variables || [],
        [selectedTemplateDetail]
    );

    console.log(JSON.stringify({variables: variableValues }));
    // The variables which has a default value would be shown here otherwise, it won't show variables
    const visibleVariables = useMemo(() =>
        variablesInSelectedTemplate.filter(variable => variable?.default_value !== null),
        [variablesInSelectedTemplate]
    );

    // Handle variable input changes - ARRAY VERSION
    const handleVariableChange = useCallback((variableId, variableName, value) => {
        setVariableValues(prev => {
            const newVariable = {
                type: "text",
                text: value
            };
            const variableIndex = visibleVariables.findIndex(v => v?.id === variableId);

            if (variableIndex !== -1) {
                const newArray = [...prev];
                newArray[variableIndex] = newVariable;
                return newArray;
            }

            return prev;
        });
    }, [visibleVariables]);

    // Helper function to get variable value by variable index
    const getVariableValue = useCallback((variableId) => {
        const variableIndex = visibleVariables.findIndex(v => v?.id === variableId);
        return variableValues[variableIndex]?.text || '';
    }, [variableValues, visibleVariables]);

    const handleTemplateChange = useCallback((e) => {
        dispatch(onChangeSelectedTemplate(e.target.value));
    }, [dispatch]);

    // Change the value of the "message"
    const handleMessageContentChange = useCallback((e) => {
        dispatch(contentOfMessage(e.target.value));
    }, [dispatch]);

    return (
        <div>
            <div className='p-4 space-y-4'>
                <div className='flex flex-row items-center justify-between gap-4'>
                    <div className='text-lg text-gray-800 font-medium py-2'>
                        <h2>Message Content</h2>
                    </div>
                    <div className='flex flex-row rounded-lg border items-center justify-center border-gray-300 shadow-sm px-3 py-2'>
                        <select
                            onChange={handleTemplateChange}
                            name="selectTemplate"
                            id="selectTemplate"
                            className='outline-none'
                            value={selectedTemplate || ""}
                        >
                            <option value="">Select Template</option>
                            {templates?.map((template) => (
                                <option key={template?.id || template?.name} value={template?.name}>
                                    {template?.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Variable inputs section */}
                {visibleVariables.length > 0 && (
                    <div>
                        <div className='text-sm text-gray-400 my-2'>
                            <h2>Fill in the template variables</h2>
                        </div>
                        <div className='grid gap-4'>
                            {
                                visibleVariables.map((variable) => (
                                    <div key={variable?.id} className='flex flex-col'>
                                        <label
                                            htmlFor={variable?.id}
                                            className='text-sm font-medium text-gray-700 mb-1 capitalize'
                                        >
                                            {variable?.name}
                                            {variable?.required && <span className='text-red-500 ml-1'>*</span>}
                                        </label>
                                        <input
                                            required={variable?.required}
                                            type={variable?.type || 'text'}
                                            name={variable?.name}
                                            id={variable?.id}
                                            value={getVariableValue(variable?.id)}
                                            onChange={(e) => handleVariableChange(
                                                variable?.id,
                                                variable?.name,
                                                e.target.value
                                            )}
                                            placeholder={`Enter ${variable?.name}`}
                                            className='px-3 py-2 rounded-lg border border-gray-200 outline-green-500 focus:border-green-500'
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Regular textarea for non-template messages */}
                {!selectedTemplate && (
                    <div className='rounded-lg'>
                        <div className='relative'>
                            <textarea
                                value={messageContent || ''}
                                placeholder="Type your new message here...."
                                onChange={handleMessageContentChange}
                                rows={6}
                                className='border-gray-300 border resize-none p-4 w-full outline-green-500 rounded-lg'
                                maxLength={1000}
                            />
                            <div className='absolute bottom-2 right-2 text-xs text-gray-400'>
                                {(messageContent || '').length}/1000
                            </div>
                        </div>
                    </div>
                )}

                {!selectedTemplate && <MediaAttatchments />}
            </div>

            {/* Custom component that is responsible for sending message either based on the selected date "scheduling messages", or it can send message directly to all the selected users  */}
            <Fragment>
                <ScheduleMessage sendTemplate={() => {
                    sendTemplateMessageToMultipleUsers(variableValues, selectedTemplateDetail);
                }} />
            </Fragment>
        </div>
    )
}

export default MessageContent