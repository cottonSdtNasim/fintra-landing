import ownershipData from "./testing_data/OwnerShipData.json";

const DEMO_SUCCESS = true;

export const OwnershipApi = {
    /**
     * Get ownership data
     * @returns {Promise<{ success: boolean, message: string, data: Object }>}
     */
    getOwnershipData: async () => {
        if (!DEMO_SUCCESS) return { success: false, message: "", data: {} };
        return ownershipData;
    },
};