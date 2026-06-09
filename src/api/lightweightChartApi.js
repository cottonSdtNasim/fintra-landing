import baseApi, { baseApiOffice } from './baseApi';
export const lightweightChartApi = {


   getPriceSeries: async (instrument_code) => {
      try {
        const response = await baseApiOffice.get(`/mkt-day-end-data/price-series?security_code=${instrument_code}`);
        return response.data;
      } catch (error) {
        console.error("Error in getPriceSeries:", error);
        return { status: false, data: [] };
      }
    },


  getVolumeSeries: async (instrument_code) => {
      try {
        const response = await baseApiOffice.get(`/mkt-day-end-data/volume-series?security_code=${instrument_code}`);
        return response.data;
      } catch (error) {
        console.error("Error in getVolumeSeries:", error);
        return { status: false, data: [] };
      }
    },
};