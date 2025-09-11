import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuthenticatedApi } from '../useAuthenticatedApi';
import {
    setCampaigns,
    setCampaignsLoading,
    setCampaignsError,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    setCampaignRecipients
} from '../../redux/campaignPage/allCampaigns';

export const useCampaignOperations = () => {
    const dispatch = useDispatch();
    const api = useAuthenticatedApi();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all campaigns
    const fetchCampaigns = async (status = null) => {
        try {
            setLoading(true);
            dispatch(setCampaignsLoading(true));
            setError(null);

            const payload = status ? { status } : {};
            const response = await api.post('/get-campaigns', payload);
            
            dispatch(setCampaigns(response.campaigns || []));
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

    // Create new campaign
    const createCampaign = async (campaignData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/add-campaign', campaignData);
            
            if (response.campaign) {
                dispatch(addCampaign(response.campaign));
            }
            
            return response;
        } catch (err) {
            const errorMessage = err.message || 'Failed to create campaign';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update existing campaign
    const updateExistingCampaign = async (campaignId, campaignData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.put(`/update-campaign/${campaignId}`, campaignData);
            
            if (response.campaign) {
                dispatch(updateCampaign(response.campaign));
            }
            
            return response;
        } catch (err) {
            const errorMessage = err.message || 'Failed to update campaign';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete campaign
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

    // Get campaign recipients
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

    // Add campaign recipients
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

    // Remove campaign recipient
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
        // Operations
        fetchCampaigns,
        createCampaign,
        updateExistingCampaign,
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


