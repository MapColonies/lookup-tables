import { IncomingHttpHeaders } from 'http';
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import axiosRetry from 'axios-retry';

//@ts-ignore
axiosRetry(axios, {
    retries: 0,
});

export interface IContext {
    requestHeaders: IncomingHttpHeaders;
};

export type requestHandlerConfig = AxiosRequestConfig;

export const requestHandler = async (url: string, method: string, params: requestHandlerConfig): Promise<AxiosResponse> => {
    const requestConfig: requestHandlerConfig = {
        url,
        method: method as Method,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        ...params,
        headers: {
            ...{ ...(params.headers ?? {}) },
        } as Record<string, unknown>,
    };

    return axios
        .request(requestConfig)
        .then((res) => res)
        .catch((error) => {
            throw error;
        });
};
