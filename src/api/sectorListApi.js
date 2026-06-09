
import baseApi, { baseApiOffice } from './baseApi';

export const sectorListApi = {
    /**
     * Get sector list-wise market overview data
     * @returns {Promise<{ status: boolean, by: string, data: Array<{}> }>}
     */
    // getSectorListData: async () => {
    //     if (!DEMO_SUCCESS) return { status: false, by: "", data: [] };
    //     return sectorListData;
    // },
      getSectorListData: async () => {
          try {
            const response = await baseApiOffice.get('/todays-data/market-overview?by=sector');
            return response.data;
          } catch (error) {
            console.error("Error in getSectorListData:", error);
            return { status: false, data: [] };
          }
        },
};