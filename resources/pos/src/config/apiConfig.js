import axios from 'axios';
import axiosInterceptor from './axiosInterceptor';
import {environment} from './environment';

const wampServer = environment.URL + '/api/';
console.log(wampServer);
const axiosApi = axios.create({
    baseURL: wampServer,
});

axiosInterceptor.setupInterceptors(axiosApi, true, false);
export default axiosApi;
