import axios from 'axios';

import { LOGOUT_USER } from '../constants/index'
export const logout = () => ({ type: LOGOUT_USER });

export default {
    setupInterceptors: (store) => {
        // Add a response interceptor
        axios.interceptors.response.use(function (response) {
            return response;
        }, function (error) {
            //catches if the session ended!
            if (error.response.status === 401) {
                store.dispatch(logout());
                //localStorage.clear();
            }
            // todo: reformat error ??
            return Promise.reject(error);
        });
    }
};