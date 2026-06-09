// import latestNews from "./testing_data/latestNews.json";

// const DEMO_SUCCESS = true;
import baseApi, { baseApiOffice } from './baseApi';

export const latestNewsApi = {
  /**
   * Get latest news data
   * @returns {Promise<{ status: boolean, count: number, data: Array<Object> }>}
   */
  // getLatestNews: async () => {
  //   if (!DEMO_SUCCESS) return { status: false, count: 0, data: [] };
  //   return latestNews;
  // },

   getLatestNews: async () => {
      try {
        const response = await baseApiOffice.get('/todays-data/man');
        return response.data;
      } catch (error) {
        console.error("Error in getLatestNews:", error);
        return { status: false, data: [] };
      }
    },
};
