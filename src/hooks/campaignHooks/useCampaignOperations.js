import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuthenticatedApi } from '../useAuthenticatedApi';
import {
    setCampaigns,
    setCampaignsLoading,
    setCampaignsError,
    addCampaign,
    deleteCampaign,
    setCampaignRecipients
} from '../../redux/campaignPage/allCampaigns';

export const useCampaignOperations = () => {
    const dispatch = useDispatch();
    const api = useAuthenticatedApi();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all campaigns using GET request
    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            dispatch(setCampaignsLoading(true));
            setError(null);

            const response = await api.get('/get-campaigns');
            
            dispatch(setCampaigns(response.campaigns || response || []));
            return response;
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch campaigns';
            setError(errorMessage);
            dispatch(setCampaignsError(errorMessage));
            throw err;
        } finally {
            setLoading(false);
            dispatch(setCampaignsLoading(false));
        }
    };

    // Create template-based campaign
    const createTemplateCampaign = async (campaignData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/messages/set-campaign', campaignData);
            
            if (response.campaign) {
                dispatch(addCampaign(response.campaign));
            }
            
            // Refresh campaigns list
            await fetchCampaigns();
            
            return response;
        } catch (err) {
            const errorMessage = err.message || 'Failed to create template campaign';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Create raw message campaign
    const createRawMessageCampaign = async (campaignData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/messages/set-campaign-raw', campaignData);
            
            if (response.campaign) {
                dispatch(addCampaign(response.campaign));
            }
            
            // Refresh campaigns list
            await fetchCampaigns();
            
            return response;
        } catch (err) {
            const errorMessage = err.message || 'Failed to create raw message campaign';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete campaign (keeping existing functionality if needed)
    const deleteCampaignById = async (campaignId) => {
        try {
            setLoading(true);
            setError(null);

            await api.delete(`/delete-campaign/${campaignId}`);
            
            dispatch(deleteCampaign(campaignId));
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Failed to delete campaign';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Get campaign recipients (keeping existing functionality if needed)
    const getCampaignRecipients = async (campaignId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/get-campaign-recipients/${campaignId}`);
            
            dispatch(setCampaignRecipients(response.recipients || []));
            return response;
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch campaign recipients';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Add campaign recipients (keeping existing functionality if needed)
    const addCampaignRecipients = async (campaignId, userIds) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post(`/add-campaign-recipient/${campaignId}`, { userIds });
            
            // Refresh recipients list
            await getCampaignRecipients(campaignId);
            
            return response;
        } catch (err) {
            const errorMessage = err.message || 'Failed to add campaign recipients';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Remove campaign recipient (keeping existing functionality if needed)
    const removeCampaignRecipient = async (recipientId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.delete(`/remove-recipient/${recipientId}`);
            
            return response;
        } catch (err) {
            const errorMessage = err.message || 'Failed to remove campaign recipient';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        // Main operations for new campaign system
        fetchCampaigns,
        createTemplateCampaign,
        createRawMessageCampaign,
        
        // Legacy operations (if still needed)
        deleteCampaignById,
        getCampaignRecipients,
        addCampaignRecipients,
        removeCampaignRecipient,
        
        // States
        loading,
        error,
        setError
    };
};