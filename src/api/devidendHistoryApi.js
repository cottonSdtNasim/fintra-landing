import dividendHistoryData from "./testing_data/dividendData.json";

const DEMO_SUCCESS = true;

export const dividendHistoryApi = {
    /**
     * Get dividend history data
     * @returns {Promise<{ success: boolean, message: string, data: Object }>}
     */
    getDividendHistoryData: async () => {
        if (!DEMO_SUCCESS) return { success: false, message: "", data: {} };
        return dividendHistoryData;
    },
};