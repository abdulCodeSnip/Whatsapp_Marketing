import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaPaperPlane, FaClock } from 'react-icons/fa';
import { useCampaignOperations } from '../../hooks/campaignHooks/useCampaignOperations';

const CreateCampaignModal = ({ isOpen, onClose, campaign = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        message: '',
        type: 'instant', // instant or scheduled
        scheduledAt: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { createCampaign, updateExistingCampaign } = useCampaignOperations();

    const isEditing = !!campaign;

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            if (campaign) {
                // Editing existing campaign
                setFormData({
                    name: campaign.name || '',
                    message: campaign.message || '',
                    type: campaign.type || 'instant',
                    scheduledAt: campaign.scheduledAt ? 
                        new Date(campaign.scheduledAt).toISOString().slice(0, 16) : ''
                });
            } else {
                // Creating new campaign
                setFormData({
                    name: '',
                    message: '',
                    type: 'instant',
                    scheduledAt: ''
                });
            }
            setErrors({});
        }
    }, [isOpen, campaign]);

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

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Campaign name is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Campaign message is required';
        }

        if (formData.type === 'scheduled' && !formData.scheduledAt) {
            newErrors.scheduledAt = 'Scheduled date and time is required';
        }

        if (formData.type === 'scheduled' && formData.scheduledAt) {
            const scheduledDate = new Date(formData.scheduledAt);
            const now = new Date();
            if (scheduledDate <= now) {
                newErrors.scheduledAt = 'Scheduled date must be in the future';
            }
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
                name: formData.name.trim(),
                message: formData.message.trim(),
                type: formData.type
            };

            // Add scheduled date if type is scheduled
            if (formData.type === 'scheduled' && formData.scheduledAt) {
                campaignData.scheduledAt = formData.scheduledAt;
            }

            if (isEditing) {
                await updateExistingCampaign(campaign.id, campaignData);
            } else {
                await createCampaign(campaignData);
            }

            onClose();
        } catch (error) {
            console.error('Failed to save campaign:', error);
            setErrors({
                submit: error.message || 'Failed to save campaign. Please try again.'
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
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isEditing ? 'Edit Campaign' : 'Create New Campaign'}
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
                    {/* Campaign Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Campaign Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter campaign name..."
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Campaign Message */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Campaign Message *
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Enter your campaign message..."
                            rows={4}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                                errors.message ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.message && (
                            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            {formData.message.length} characters
                        </p>
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
                                    id="instant"
                                    name="type"
                                    value="instant"
                                    checked={formData.type === 'instant'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                />
                                <label htmlFor="instant" className="ml-3 flex items-center">
                                    <FaPaperPlane className="text-green-600 mr-2" size={16} />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Send Instantly</div>
                                        <div className="text-sm text-gray-500">Campaign will be sent immediately</div>
                                    </div>
                                </label>
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="scheduled"
                                    name="type"
                                    value="scheduled"
                                    checked={formData.type === 'scheduled'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                />
                                <label htmlFor="scheduled" className="ml-3 flex items-center">
                                    <FaClock className="text-blue-600 mr-2" size={16} />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Schedule for Later</div>
                                        <div className="text-sm text-gray-500">Schedule campaign for a specific date and time</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Scheduled Date/Time */}
                    {formData.type === 'scheduled' && (
                        <div>
                            <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700 mb-2">
                                <FaCalendarAlt className="inline mr-2" size={14} />
                                Scheduled Date & Time *
                            </label>
                            <input
                                type="datetime-local"
                                id="scheduledAt"
                                name="scheduledAt"
                                value={formData.scheduledAt}
                                onChange={handleInputChange}
                                min={getMinDateTime()}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                    errors.scheduledAt ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.scheduledAt && (
                                <p className="mt-1 text-sm text-red-600">{errors.scheduledAt}</p>
                            )}
                        </div>
                    )}

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
                            {isSubmitting ? (
                                isEditing ? 'Updating...' : 'Creating...'
                            ) : (
                                isEditing ? 'Update Campaign' : 'Create Campaign'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaignModal;


