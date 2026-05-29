import {Tokens, errorMessage} from '../constants';
import {environment} from './environment'
import Cookies from 'js-cookie';

export default {
    setupInterceptors: (axios, isToken = false, isFormData = false) => {
        axios.interceptors.request.use((config) => {
                if (isToken) {
                    return config;
                }
                let isToken = Cookies.get('authToken');
                if (isToken) {
                    config.headers['Authorization'] = `Bearer ${isToken}`;
                }
                if (!isToken) {
                    if (!window.location.href.includes('login') && !window.location.href.includes('reset-password') && !window.location.href.includes('forgot-password')) {
                        window.location.href = environment.URL + '#/' + 'login';
                    }
                }
                if (isFormData) {
                    config.headers['Content-Type'] = 'multipart/form-data';
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        axios.interceptors.response.use(
            response => successHandler(response),
            error => errorHandler(error)
        );
        const errorHandler = (error) => {
            const status = error?.response?.status;
            const message = error?.response?.data?.message;
            const requestUrl = String(error?.config?.url || '');

            if (status === 401
                || message === errorMessage.TOKEN_NOT_PROVIDED
                || message === errorMessage.TOKEN_INVALID
                || message === errorMessage.TOKEN_INVALID_SIGNATURE
                || message === errorMessage.TOKEN_EXPIRED) {
                localStorage.removeItem(Tokens.ADMIN);
                localStorage.removeItem(Tokens.USER);
                localStorage.removeItem(Tokens.GET_PERMISSIONS);
                window.location.href = environment.URL + '#' + '/login';
            }

            if (status === 403 || status === 404) {
                if (!requestUrl.includes('login')) {
                    window.location.href = environment.URL + '#' + '/app/dashboard';
                }
            }

            return Promise.reject({ ...error });
        };
        const successHandler = (response) => {
            return response;
        };
    }
};
