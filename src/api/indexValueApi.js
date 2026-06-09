import baseApi from './baseApi';

export const fetchMarketIndexSnapshotLate = async () => {
  const response = await baseApi.get('/market/index-snapshot/late');
  return response.data;
};
