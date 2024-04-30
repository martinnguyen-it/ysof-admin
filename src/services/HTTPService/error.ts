import { AxiosError, type AxiosResponse } from 'axios';

import { toast } from 'react-toastify';
import { HTTPStatusCode, serverErrorDataToString } from './helpers';
import { HTTPRequest, RequestParams } from './types';

/**
 * HTTP request function wrapper to handle error
 *
 * @param {HTTPRequest} func
 * @param unauthorizedEvent
 * @returns {HTTPRequest}
 */

let code = '';

export const serviceErrorHandler =
    (func: HTTPRequest): HTTPRequest =>
    async (params: RequestParams): Promise<AxiosResponse<any> | any> => {
        try {
            const res = await func(params);
            return res;
        } catch (e) {
            const error: any = e as AxiosError;
            let message;
            if (error?.response) {
                message = serverErrorDataToString(error?.response?.data);
                if (code !== error?.response?.status) {
                    switch (error?.response?.status) {
                        case HTTPStatusCode.SERVICE_UNAVAILABLE:
                            message = 'Service Temporarily Unavailable';
                            break;
                        default:
                            break;
                    }
                }
                if (message) {
                    toast.error(message);
                }
                code = error?.response?.status;
            }
        }
    };
