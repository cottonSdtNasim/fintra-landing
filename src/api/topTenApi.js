// import topTenData from "./testing_data/topTenData.json";

// const DEMO_SUCCESS = true;

import baseApi, { baseApiOffice } from './baseApi';

export const topTenApi = {
    /**
     * Get top ten-wise market data
     * @param {string} by - The category to get data for (e.g. "value", "trades", "volume")
     * @returns {Promise<{ status: boolean, by: string, data: Array<{}> }>}
     */
    // getTopTenData: async (by = "value") => {
    //     if (!DEMO_SUCCESS) return { status: false, by, data: [] };
        
    //     // Find the specific data object for the requested 'by' category
    //     const result = topTenData.find(item => item.by === by);
        
    //     return result || { status: false, by, data: [] };
    // },
    getTopTenData: async (by = "value") => {
      try {
        const response = await baseApiOffice.get(`/todays-data/top10?by=${by}`);
        return response.data;
      } catch (error) {
        console.error("Error in getTopTenData:", error);
        return { status: false, data: [] };
      }
    },
};