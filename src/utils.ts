import axios, { AxiosResponse, Method } from 'axios';
import axiosRetry from 'axios-retry';
import qs from 'qs';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
axiosRetry(axios, {
  retries: 0,
});

// eslint-disable-next-line
export const requestHandler = async (url: string, method: string, params: any): Promise<AxiosResponse> => {
  return axios
    .request({ url, method: method as Method, params: params as Record<string, unknown>, paramsSerializer: (params) => qs.stringify(params) })
    .catch((error) => {
      throw error;
    });
};
