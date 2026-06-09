import companyContactData from "./testing_data/companyContact.json";
import securityCompanyInfoData from "./testing_data/securityCompanyInfo.json";
import instrumentSnapshotData from "./testing_data/instrumentSnapshot.json";
import dividendDataFixture from "./testing_data/dividendData.json";
import manByInstrumentData from "./testing_data/manByInstrument.json";
import baseApi, { baseApiOffice, baseApiOfficeLocal } from './baseApi';

const DEMO_SUCCESS = true;

// ownership data cache
const ownershipCache = new Map();
const OWNERSHIP_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export const companyDetailsApi = {
  /**
   * Get security -> company info list
   * Endpoint: GET /security-company-info
   * @returns {Promise<{ success: boolean, data: Array<{ security_code: string, company_name: string, sector: string }> }>}
   */
  getSecurityCompanyInfo: async () => {
    try {
      const response = await baseApiOffice.get('/security-company-info');
      return response.data;
    } catch (error) {
      console.error("Error in getSecurityCompanyInfo:", error);
      return { status: false, data: [] };
    }
  },

  /**
   * Get instrument snapshot by INSTRUMENT_CODE
   * Endpoint: GET /todays-data/instrument-snapshot?INSTRUMENT_CODE=XXXX
   * @param {string} instrumentCode
   * @returns {Promise<{
   *   status: boolean,
   *   last_updated?: string,
   *   data?: {
   *     INSTRUMENT_CODE: string,
   *     company_name: string,
   *     sector: string,
   *     LAST_TRADED_PRICE: string,
   *     CHANGE_YDAY_CLOSE: string,
   *     CHANGE_PCT_YDAY_CLOSE: string
   *   },
   *   company_info?: {
   *     company_details: string,
   *     TOTAL_TRADES: number,
   *     TOTAL_VOLUME: number,
   *     TOTAL_VALUE: string,
   *     LAST_TRADED_PRICE: string
   *   }
   * }>}
   */
  getInstrumentSnapshot: async (instrumentCode) => {
    if (!DEMO_SUCCESS) return { status: false };
    // Return raw fixture JSON
    return instrumentSnapshotData;
  },

  /**
   * Fetches company contact information based on the provided security/instrument code.
   *
   * Sends a GET request to the investor contact info endpoint with the given
   * `security_code` as a query parameter.
   *
   * On success, returns an object with the following structure:
   * {
   *   success: boolean,
   *   data: [
   *     {
   *       id: number,
   *       investor_id: string,
   *       security_code: string,
   *       head_office: string,
   *       factory: string,
   *       contact_phone: string,
   *       fax: string,
   *       company_email: string,
   *       web_address: string,
   *       company_secretary_name: string,
   *       cell_no: string,
   *       telephone_no: string,
   *       secretary_email: string,
   *       created_at: string (ISO date),
   *       updated_at: string (ISO date)
   *     }
   *   ],
   *   pagination: {
   *     current_page: number,
   *     last_page: number,
   *     per_page: number,
   *     total: number
   *   }
   * }
   *
   * On failure:
   * {
   *   success: false
   * }
   *
   * In case of an error, it attempts to handle the error via `handleApiError`.
   *
   * @param {string} instrumentCode - The security code of the company (e.g., "SQURPHARMA")
   * @returns {Promise<Object>} API response object with contact details or failure status
   */
  // getCompanyContact: async (instrumentCode) => {
  //   if (!DEMO_SUCCESS) return { success: false };
  //   // Return raw fixture JSON (no filtering)
  //   return companyContactData;
  // },

  // https://office-testb.fintra.com.bd/api/investor-contact-info/investor-contact-info-index?security_code=SQURPHARMA 
  // here instrument_code = security_code
  // in api endpoint we need to use security_code and in code we are passing instrument_code 
  getCompanyContact: async (instrument_code ) => {
      try {
        const response = await baseApiOffice.get(`/investor-contact-info/investor-contact-info-index?security_code=${instrument_code}`);
        return response.data;
      } catch (error) {
        console.error("Error in getTopTenData:", error);
        return { status: false, data: [] };
      }
    },

  /**
   * Get dividend data (cash + stock) by instrument_code
   * Endpoint: GET /instrument/dividend-data?instrument_code=XXX
   * @param {string} instrument_code
   * @returns {Promise<{ success: boolean, message?: string, data?: { instrument_code: string, cash_dividend: Array<{ year: number, amount: string }>, stock_dividend: Array<{ year: number, amount: string }> } }>}
   */
  // getDividendData: async (instrument_code) => {
  //   if (!DEMO_SUCCESS) return { success: false, data: null };
  //   // Return raw fixture JSON
  //   return dividendDataFixture;
  // },

  getDividendHistoryData: async (instrument_code) => {
      try {
        const response = await baseApiOffice.get(`/instrument/dividend-data?instrument_code=${instrument_code}`);
        return response.data;
      } catch (error) {
        console.error("Error in getTopTenData:", error);
        return { status: false, data: [] };
      }
    },

  /**
   * Fetch instrument-wise market announcements (MAN).
   *
   * Retrieves paginated market announcements for a specific instrument code.
   *
   * @param {string} instrument_code - The instrument / ticker symbol (e.g. "GLDNJMF").
   * @param {number} [page=1] - Page number for pagination.
   * @param {number} [per_page=10] - Number of records per page.
   *
   * @returns {Promise<{
   *   status: boolean,
   *   instrument_code?: string,
   *   count?: number,
   *   data: Array<{
   *     MAN_ANNOUNCEMENT_DATE_TIME: string,
   *     MAN_ANNOUNCEMENT_PREFIX: string,
   *     MAN_ANNOUNCEMENT: string
   *   }>,
   *   page?: number,
   *   per_page?: number,
   *   source?: string
   * }>}
   */
  getManByInstrument: async (instrument_code, page = 1, per_page = 10) => {
      try {
        const response = await baseApiOffice.get(`/todays-data/man-by-instrument?instrument_code=${instrument_code}&page=${page}&per_page=${per_page}`);
        return response.data;
      } catch (error) {
        console.error("Error in getTopTenData:", error);
        return { status: false, data: [] };
      }
    },


    // ownership data (with chace funtion)
    getOwnershipData: async (instrument_code, page = 1, per_page = 20) => {
      const cacheKey = `${instrument_code}_${page}_${per_page}`;
      const now = Date.now();
      
      if (ownershipCache.has(cacheKey)) {
        const cached = ownershipCache.get(cacheKey);
        if (now - cached.timestamp < OWNERSHIP_CACHE_TTL) {
          return cached.data;
        }
      }

      try {
        const response = await baseApiOfficeLocal.get(`/mkt-security-code-ownership/by-instrument/${instrument_code}?page=${page}&per_page=${per_page}`);
        
        ownershipCache.set(cacheKey, {
          timestamp: now,
          data: response.data
        });
        
        return response.data;
      } catch (error) {
        console.error("Error in getOwnershipData:", error);
        return { success: false, data: [] };
      }
    },
};