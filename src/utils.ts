import axios, {  AxiosResponse, Method } from 'axios';
import axiosRetry from 'axios-retry';

//@ts-ignore
axiosRetry(axios, {
    retries: 0,
});

export const requestHandler = async (url: string, method: string, params: any): Promise<AxiosResponse> => {

    return axios
        .request({url, method: method as Method, params})
        .then((res) => res)
        .catch((error) => {
            throw error;
        });
};
