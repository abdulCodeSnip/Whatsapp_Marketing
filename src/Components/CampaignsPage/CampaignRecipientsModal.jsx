import React, { useState, useEffect } from 'react';
import { FaTimes, FaUsers, FaPlus, FaTrash, FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useCampaignOperations } from '../../hooks/campaignHooks/useCampaignOperations';
import useFetchAllContacts from '../../hooks/Contacts Hook/useFetchAllContacts';
import Spinner from '../Spinner';

const CampaignRecipientsModal = ({ isOpen, onClose, campaign }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Redux state
    const { campaignRecipients } = useSelector((state) => state.allCampaigns);
    const { fetchContacts } = useFetchAllContacts();

    // Campaign operations
    const { 
        getCampaignRecipients, 
        addCampaignRecipients, 
        removeCampaignRecipient,
        loading: operationLoading 
    } = useCampaignOperations();

    // Load campaign recipients when modal opens
    useEffect(() => {
        if (isOpen && campaign?.id) {
            getCampaignRecipients(campaign.id);
        }
    }, [isOpen, campaign?.id]);

    // Filter available contacts (not already recipients)
    const availableContacts = (Array.isArray(fetchContacts) ? fetchContacts : []).filter(contact => {
        const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim();
        return !campaignRecipients.some(recipient => recipient.userId === contact.id) &&
               (fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.phone?.includes(searchTerm));
    });

    // Handle adding recipients
    const handleAddRecipients = async () => {
        if (!campaign?.id || selectedContacts.length === 0) return;

        try {
            setIsLoading(true);
            await addCampaignRecipients(campaign.id, selectedContacts);
            setSelectedContacts([]);
            setSearchTerm('');
        } catch (error) {
            console.error('Failed to add recipients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle removing recipient
    const handleRemoveRecipient = async (recipientId) => {
        try {
            setIsLoading(true);
            await removeCampaignRecipient(recipientId);
            // Refresh recipients list
            if (campaign?.id) {
                await getCampaignRecipients(campaign.id);
            }
        } catch (error) {
            console.error('Failed to remove recipient:', error);
        } finally {
            setIsLoading(false);
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

    // Handle select all
    const handleSelectAll = () => {
        const allAvailableIds = availableContacts.map(contact => contact.id);
        setSelectedContacts(allAvailableIds);
    };

    // Handle clear selection
    const handleClearSelection = () => {
        setSelectedContacts([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Campaign Recipients
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Manage recipients for "{campaign?.name}"
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaTimes className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex">
                    {/* Current Recipients */}
                    <div className="w-1/2 border-r border-gray-200 flex flex-col">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="font-medium text-gray-900 flex items-center">
                                <FaUsers className="mr-2" size={16} />
                                Current Recipients ({campaignRecipients.length})
                            </h3>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4">
                            {operationLoading ? (
                                <div className="flex justify-center py-8">
                                    <Spinner />
                                </div>
                            ) : campaignRecipients.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <FaUsers size={32} className="mx-auto mb-2 opacity-50" />
                                    <p>No recipients added yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {campaignRecipients.map((recipient) => (
                                        <div key={recipient.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">
                                                    {recipient.user?.name || 'Unknown User'}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {recipient.user?.email || recipient.user?.phone || 'No contact info'}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveRecipient(recipient.id)}
                                                disabled={isLoading}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                title="Remove recipient"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Add Recipients */}
                    <div className="w-1/2 flex flex-col">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="font-medium text-gray-900 mb-3">
                                Add Recipients
                            </h3>
                            
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
                            {availableContacts.length > 0 && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSelectAll}
                                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        Select All ({availableContacts.length})
                                    </button>
                                    {selectedContacts.length > 0 && (
                                        <>
                                            <span className="text-gray-300">|</span>
                                            <button
                                                onClick={handleClearSelection}
                                                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                            >
                                                Clear ({selectedContacts.length})
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Available Contacts */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {availableContacts.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <FaUsers size={32} className="mx-auto mb-2 opacity-50" />
                                    <p>
                                        {searchTerm 
                                            ? 'No contacts found matching your search'
                                            : 'All contacts are already recipients'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {availableContacts.map((contact) => (
                                        <div
                                            key={contact.id}
                                            onClick={() => handleContactSelect(contact.id)}
                                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                selectedContacts.includes(contact.id)
                                                    ? 'bg-green-50 border-green-300'
                                                    : 'bg-white border-gray-200 hover:bg-gray-50'
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
                                                    <div className="font-medium text-gray-900">
                                                        {`${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 'Unknown'}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {contact.email || contact.phone || 'No contact info'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Add Button */}
                        {selectedContacts.length > 0 && (
                            <div className="p-4 border-t border-gray-200">
                                <button
                                    onClick={handleAddRecipients}
                                    disabled={isLoading}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    <FaPlus size={14} />
                                    {isLoading ? 'Adding...' : `Add ${selectedContacts.length} Recipient${selectedContacts.length > 1 ? 's' : ''}`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignRecipientsModal;



