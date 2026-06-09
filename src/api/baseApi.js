import axios from 'axios';

const baseApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export const baseApiOffice = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_OFFICE,
});

export const baseApiOfficeLocal = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_OFFICE_LOCAL,
});


export default baseApi;
