
import baseApi, { baseApiOffice } from './baseApi';

export const marketOverviewApi = {
  /**
   * Get market overview data
   * @returns {Promise<{ status: boolean, count: number, data: Object }>}
   */

   getMarketOverview: async () => {
      try {
        const response = await baseApiOffice.get('todays-data/market-overview?by=overall');
        return response.data;
      } catch (error) {
        console.error("Error in getMarketOverview:", error);
        return { status: false, data: [] };
      }
    },

    // market sentimet

      getMarketSentiment: async () => {
      try {
        const response = await baseApiOffice.get('todays-data/sentiment');
        return response.data;
      } catch (error) {
        console.error("Error in getMarketSentiment:", error);
        return { status: false, data: [] };
      }
    },
};