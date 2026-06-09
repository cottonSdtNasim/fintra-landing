import hitmapData from "./testing_data/hitmapData.json";

const DEMO_SUCCESS = true;
import baseApi, { baseApiOffice } from './baseApi';
export const hitmapApi = {
  /**
   * Get heatmap data
   * @returns {Promise<{ status: boolean, count: number, last_updated: string, data: Array<Object> }>}
   */
  // getHitmapData: async () => {
  //   if (!DEMO_SUCCESS) return { status: false, count: 0, data: [] };
  //   return hitmapData;
// },
    getHitmapData: async () => {
      try {
        const response = await baseApiOffice.get('/todays-data/latest');
        return response.data;
      } catch (error) {
        console.error("Error in getLatestNews:", error);
        return { status: false, data: [] };
      }
    },
  
};
