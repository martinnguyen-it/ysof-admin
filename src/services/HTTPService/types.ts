import { type AxiosRequestConfig, type AxiosResponse } from 'axios';

export interface RequestParams {
    url: string;
    options?: AxiosRequestConfig & { credentials?: string };
    data?: Record<string, any> | string;
    token?: string;
}

export type HTTPRequest = (params: RequestParams) => Promise<AxiosResponse>;

export type FailureResponse = {
    message: string;
};

export interface ErrorDetail {
    loc: string[];
    msg: string;
    type: string;
}

export interface ServerErrorData {
    detail?: ErrorDetail[] | string;
    error?:
        | {
              code: number;
              message?: string;
          }
        | string;
    message?: string;
}
