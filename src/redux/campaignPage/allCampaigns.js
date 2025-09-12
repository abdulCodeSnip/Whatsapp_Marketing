import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    campaigns: [],
    loading: false,
    error: null,
    selectedCampaign: null,
    campaignRecipients: []
};

const allCampaigns = createSlice({
    name: "allCampaigns",
    initialState: initialState,
    reducers: {
        // Set all campaigns
        setCampaigns: (state, action) => {
            state.campaigns = action.payload;
            state.loading = false;
            state.error = null;
        },
        
        // Set loading state
        setCampaignsLoading: (state, action) => {
            state.loading = action.payload;
        },
        
        // Set error state
        setCampaignsError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        
        // Add new campaign
        addCampaign: (state, action) => {
            state.campaigns.unshift(action.payload);
            state.error = null;
        },
        
        // Update existing campaign
        updateCampaign: (state, action) => {
            const index = state.campaigns.findIndex(campaign => campaign.id === action.payload.id);
            if (index !== -1) {
                state.campaigns[index] = action.payload;
            }
            state.error = null;
        },
        
        // Delete campaign
        deleteCampaign: (state, action) => {
            state.campaigns = state.campaigns.filter(campaign => campaign.id !== action.payload);
            state.error = null;
        },
        
        // Set selected campaign
        setSelectedCampaign: (state, action) => {
            state.selectedCampaign = action.payload;
        },
        
        // Set campaign recipients
        setCampaignRecipients: (state, action) => {
            state.campaignRecipients = action.payload;
        },
        
        // Clear all campaigns data
        clearCampaigns: (state) => {
            state.campaigns = [];
            state.selectedCampaign = null;
            state.campaignRecipients = [];
            state.loading = false;
            state.error = null;
        }
    }
});

export const {
    setCampaigns,
    setCampaignsLoading,
    setCampaignsError,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    setSelectedCampaign,
    setCampaignRecipients,
    clearCampaigns
} = allCampaigns.actions;

export default allCampaigns.reducer;



