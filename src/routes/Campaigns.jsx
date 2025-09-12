import React, { useEffect, useState } from 'react';
import { FaPlus, FaSearch, FaFilter, FaTrash, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { MdSchedule, MdCheckCircle, MdCancel, MdPending } from 'react-icons/md';
import { useSelector } from 'react-redux';
import SideBar from '../Components/SideBar';
import { useCampaignOperations } from '../hooks/campaignHooks/useCampaignOperations';
import Spinner from '../Components/Spinner';
import CreateCampaignModal from '../Components/CampaignsPage/CreateCampaignModal';
import CampaignRecipientsModal from '../Components/CampaignsPage/CampaignRecipientsModal';

const Campaigns = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showRecipientsModal, setShowRecipientsModal] = useState(false);

    // Redux state
    const { campaigns, loading } = useSelector((state) => state.allCampaigns);
    
    // Campaign operations
    const { 
        fetchCampaigns, 
        deleteCampaignById,
        loading: operationLoading,
        error 
    } = useCampaignOperations();

    // Fetch campaigns on component mount
    useEffect(() => {
        fetchCampaigns();
    }, []);

    // Filter campaigns based on search and status
    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            campaign.message?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Get status icon and color
    const getStatusDisplay = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return { icon: MdPending, color: 'text-yellow-500', bg: 'bg-yellow-100' };
            case 'completed':
                return { icon: MdCheckCircle, color: 'text-green-500', bg: 'bg-green-100' };
            case 'cancelled':
                return { icon: MdCancel, color: 'text-red-500', bg: 'bg-red-100' };
            case 'scheduled':
                return { icon: MdSchedule, color: 'text-blue-500', bg: 'bg-blue-100' };
            default:
                return { icon: MdPending, color: 'text-gray-500', bg: 'bg-gray-100' };
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid date';
        }
    };

    // Handle delete campaign
    const handleDeleteCampaign = async () => {
        if (!selectedCampaign) return;
        
        try {
            await deleteCampaignById(selectedCampaign.id);
            setShowDeleteConfirm(false);
            setSelectedCampaign(null);
        } catch (err) {
            console.error('Failed to delete campaign:', err);
        }
    };


    // Handle manage recipients
    const handleManageRecipients = (campaign) => {
        setSelectedCampaign(campaign);
        setShowRecipientsModal(true);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <SideBar />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
                            <p className="text-gray-600 mt-1">Manage your WhatsApp marketing campaigns</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <FaPlus size={16} />
                            Create Campaign
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search campaigns..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spinner />
                        </div>
                    ) : filteredCampaigns.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <MdSchedule size={64} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm || statusFilter !== 'all' 
                                    ? 'Try adjusting your search or filters'
                                    : 'Create your first campaign to get started'
                                }
                            </p>
                            {!searchTerm && statusFilter === 'all' && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
                                >
                                    <FaPlus size={16} />
                                    Create Campaign
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredCampaigns.map((campaign) => {
                                const statusDisplay = getStatusDisplay(campaign.status);
                                const StatusIcon = statusDisplay.icon;

                                return (
                                    <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            {/* Campaign Header */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {campaign.name || 'Untitled Campaign'}
                                                    </h3>
                                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                                                        <StatusIcon className="mr-1" size={12} />
                                                        {campaign.status || 'pending'}
                                                    </div>
                                                </div>
                                                
                                                {/* Action Buttons */}
                                                {/* <div className="flex gap-1 ml-4">
                                                    <button
                                                        onClick={() => handleManageRecipients(campaign)}
                                                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Manage Recipients"
                                                    >
                                                        <FaUsers size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCampaign(campaign);
                                                            setShowDeleteConfirm(true);
                                                        }}
                                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Campaign"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div> */}
                                            </div>

                                            {/* Campaign Message */}
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600 line-clamp-3">
                                                    {campaign.message || 'No message content'}
                                                </p>
                                            </div>

                                            {/* Campaign Details */}
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center text-gray-600">
                                                    <FaCalendarAlt className="mr-2" size={12} />
                                                    <span>Created: {formatDate(campaign.createdAt)}</span>
                                                </div>
                                                
                                                {campaign.scheduledAt && (
                                                    <div className="flex items-center text-gray-600">
                                                        <MdSchedule className="mr-2" size={12} />
                                                        <span>Scheduled: {formatDate(campaign.scheduledAt)}</span>
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center text-gray-600">
                                                    <FaUsers className="mr-2" size={12} />
                                                    <span>Recipients: {campaign.recipientCount || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Campaign Modal */}
            <CreateCampaignModal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setSelectedCampaign(null);
                }}
            />

            {/* Campaign Recipients Modal */}
            <CampaignRecipientsModal
                isOpen={showRecipientsModal}
                onClose={() => {
                    setShowRecipientsModal(false);
                    setSelectedCampaign(null);
                }}
                campaign={selectedCampaign}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Campaign</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete "{selectedCampaign?.name}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteCampaign}
                                disabled={operationLoading}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                            >
                                {operationLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Campaigns;
