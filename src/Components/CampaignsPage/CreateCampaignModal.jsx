import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaPaperPlane, FaClock, FaUsers, FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useCampaignOperations } from '../../hooks/campaignHooks/useCampaignOperations';
import useFetchTemplates from '../../hooks/useFetchTemplates';
import useFetchAllContacts from '../../hooks/Contacts Hook/useFetchAllContacts';

const CreateCampaignModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        campaignName: '',
        campaignType: 'template', // template or raw
        messageTemplateName: '',
        text: '',
        scheduleTime: '',
        numbers: []
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContacts, setSelectedContacts] = useState([]);

    const { createTemplateCampaign, createRawMessageCampaign } = useCampaignOperations();
    const { fetchedTemplates } = useFetchTemplates();
    const { fetchContacts } = useFetchAllContacts();

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
                setFormData({
                campaignName: '',
                campaignType: 'template',
                messageTemplateName: '',
                text: '',
                scheduleTime: '',
                numbers: []
            });
            setSelectedContacts([]);
            setSearchTerm('');
            setErrors({});
        }
    }, [isOpen]);

    // Update numbers when contacts are selected
    useEffect(() => {
        const phoneNumbers = selectedContacts
            .map(contactId => {
                const contact = Array.isArray(fetchContacts) ? fetchContacts.find(c => c.id === contactId) : null;
                return contact?.phone;
            })
            .filter(phone => phone);
        
        setFormData(prev => ({
            ...prev,
            numbers: phoneNumbers
        }));
    }, [selectedContacts, fetchContacts]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle contact selection
    const handleContactSelect = (contactId) => {
        setSelectedContacts(prev => 
            prev.includes(contactId) 
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    // Handle select all contacts
    const handleSelectAll = () => {
        const allContactIds = filteredContacts.map(contact => contact.id);
        setSelectedContacts(allContactIds);
    };

    // Handle clear selection
    const handleClearSelection = () => {
        setSelectedContacts([]);
    };

    // Filter contacts based on search term
    const filteredContacts = (Array.isArray(fetchContacts) ? fetchContacts : []).filter(contact => {
        const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim();
        return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               contact.phone?.includes(searchTerm);
    });

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.campaignName.trim()) {
            newErrors.campaignName = 'Campaign name is required';
        }

        if (formData.campaignType === 'template' && !formData.messageTemplateName) {
            newErrors.messageTemplateName = 'Template selection is required';
        }

        if (formData.campaignType === 'raw' && !formData.text.trim()) {
            newErrors.text = 'Message text is required';
        }

        if (!formData.scheduleTime) {
            newErrors.scheduleTime = 'Schedule time is required';
        }

        if (formData.scheduleTime) {
            const scheduledDate = new Date(formData.scheduleTime);
            const now = new Date();
            if (scheduledDate <= now) {
                newErrors.scheduleTime = 'Scheduled date must be in the future';
            }
        }

        if (formData.numbers.length === 0) {
            newErrors.numbers = 'At least one contact must be selected';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const campaignData = {
                numbers: formData.numbers,
                scheduleTime: formData.scheduleTime,
                campaignName: formData.campaignName
            };

            if (formData.campaignType === 'template') {
                campaignData.messageTemplateName = formData.messageTemplateName;
                await createTemplateCampaign(campaignData);
            } else {
                campaignData.text = formData.text;
                await createRawMessageCampaign(campaignData);
            }

            onClose();
        } catch (error) {
            console.error('Failed to create campaign:', error);
            setErrors({
                submit: error.message || 'Failed to create campaign. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get minimum date for scheduling (current date/time)
    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 5); // Add 5 minutes buffer
        return now.toISOString().slice(0, 16);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Create New Campaign
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaTimes className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Campaign Details */}
                        <div className="space-y-6">
                    {/* Campaign Name */}
                    <div>
                                <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-2">
                            Campaign Name *
                        </label>
                        <input
                            type="text"
                                    id="campaignName"
                                    name="campaignName"
                                    value={formData.campaignName}
                            onChange={handleInputChange}
                            placeholder="Enter campaign name..."
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                        errors.campaignName ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                                {errors.campaignName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.campaignName}</p>
                        )}
                    </div>

                    {/* Campaign Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Campaign Type *
                        </label>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                            id="template"
                                            name="campaignType"
                                            value="template"
                                            checked={formData.campaignType === 'template'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                />
                                        <label htmlFor="template" className="ml-3 flex items-center">
                                    <FaPaperPlane className="text-green-600 mr-2" size={16} />
                                    <div>
                                                <div className="text-sm font-medium text-gray-900">Template Message</div>
                                                <div className="text-sm text-gray-500">Use a pre-approved WhatsApp template</div>
                                    </div>
                                </label>
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                            id="raw"
                                            name="campaignType"
                                            value="raw"
                                            checked={formData.campaignType === 'raw'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                />
                                        <label htmlFor="raw" className="ml-3 flex items-center">
                                    <FaClock className="text-blue-600 mr-2" size={16} />
                                    <div>
                                                <div className="text-sm font-medium text-gray-900">Raw Message</div>
                                                <div className="text-sm text-gray-500">Send custom text message</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                            {/* Template Selection */}
                            {formData.campaignType === 'template' && (
                                <div>
                                    <label htmlFor="messageTemplateName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Template *
                                    </label>
                                    <select
                                        id="messageTemplateName"
                                        name="messageTemplateName"
                                        value={formData.messageTemplateName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                            errors.messageTemplateName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select a template...</option>
                                        {fetchedTemplates && Array.isArray(fetchedTemplates) ? fetchedTemplates.map((template) => (
                                            <option key={template.name} value={template.name}>
                                                {template.name}
                                            </option>
                                        )) : null}
                                    </select>
                                    {errors.messageTemplateName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.messageTemplateName}</p>
                                    )}
                                </div>
                            )}

                            {/* Raw Message Text */}
                            {formData.campaignType === 'raw' && (
                                <div>
                                    <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message Text *
                                    </label>
                                    <textarea
                                        id="text"
                                        name="text"
                                        value={formData.text}
                                        onChange={handleInputChange}
                                        placeholder="Enter your message text..."
                                        rows={4}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                                            errors.text ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.text && (
                                        <p className="mt-1 text-sm text-red-600">{errors.text}</p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        {formData.text.length} characters
                                    </p>
                                </div>
                            )}

                            {/* Schedule Time */}
                        <div>
                                <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700 mb-2">
                                <FaCalendarAlt className="inline mr-2" size={14} />
                                    Schedule Date & Time *
                            </label>
                            <input
                                type="datetime-local"
                                    id="scheduleTime"
                                    name="scheduleTime"
                                    value={formData.scheduleTime}
                                onChange={handleInputChange}
                                min={getMinDateTime()}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                        errors.scheduleTime ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                                {errors.scheduleTime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.scheduleTime}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Contact Selection */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    <FaUsers className="inline mr-2" size={14} />
                                    Select Recipients * ({selectedContacts.length} selected)
                                </label>

                                {/* Search */}
                                <div className="relative mb-3">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search contacts..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                    />
                                </div>

                                {/* Selection Actions */}
                                {filteredContacts.length > 0 && (
                                    <div className="flex gap-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={handleSelectAll}
                                            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            Select All ({filteredContacts.length})
                                        </button>
                                        {selectedContacts.length > 0 && (
                                            <>
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    type="button"
                                                    onClick={handleClearSelection}
                                                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                                >
                                                    Clear ({selectedContacts.length})
                                                </button>
                                            </>
                            )}
                        </div>
                    )}

                                {/* Contacts List */}
                                <div className="border border-gray-300 rounded-lg max-h-80 overflow-y-auto">
                                    {filteredContacts.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <FaUsers size={32} className="mx-auto mb-2 opacity-50" />
                                            <p>
                                                {searchTerm 
                                                    ? 'No contacts found matching your search'
                                                    : 'No contacts available'
                                                }
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 p-2">
                                            {filteredContacts.map((contact) => (
                                                <div
                                                    key={contact.id}
                                                    onClick={() => handleContactSelect(contact.id)}
                                                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                                        selectedContacts.includes(contact.id)
                                                            ? 'bg-green-50 border border-green-300'
                                                            : 'bg-white hover:bg-gray-50 border border-transparent'
                                                    }`}
                                                >
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedContacts.includes(contact.id)}
                                                            onChange={() => handleContactSelect(contact.id)}
                                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-3"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900 text-sm">
                                                                {`${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 'Unknown'}
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                {contact.phone || contact.email || 'No contact info'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {errors.numbers && (
                                    <p className="mt-1 text-sm text-red-600">{errors.numbers}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaignModal;