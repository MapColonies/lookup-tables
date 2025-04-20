import axios, { AxiosResponse, Method } from 'axios';
import axiosRetry from 'axios-retry';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
axiosRetry(axios, {
  retries: 0,
});

// eslint-disable-next-line
export const requestHandler = async (url: string, method: string, params: any): Promise<AxiosResponse> => {
  return axios
    .request({ url, method: method as Method, params: params as Record<string, unknown> })
    .then((res) => res)
    .catch((error) => {
      throw error;
    });
};
