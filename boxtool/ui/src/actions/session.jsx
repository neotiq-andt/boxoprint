import axios from 'axios';
import {
    apiUrl,
    SIGNIN_USER,
    SIGNIN_USER_SUCCESS,
    SIGNIN_USER_FAILURE,
    SIGNIN_USER_RESET,
} from '../constants/index'
import * as Yup from 'yup';

const userSchema = Yup.object().shape({
    login: Yup.string().required(),
    role: Yup.string().oneOf(['admin', 'partner', 'client', 'user', 'none']).default('none').required(),
    sessionId: Yup.string().required(),
    superToken: Yup.string()
});

const meSchema = Yup.object().shape({
    status: Yup.string().oneOf(['ok']).default('none').required(),
    login: Yup.string().required(),
    role: Yup.string().oneOf(['admin', 'partner', 'client', 'user', 'none']).default('none').required(),
});


export const signin_user = () => ({ type: SIGNIN_USER });
export const signin_reset = () => ({ type: SIGNIN_USER_RESET });
export const signin_success = (user) => ({ type: SIGNIN_USER_SUCCESS, payload: user });
export const signin_failed = (error) => ({ type: SIGNIN_USER_FAILURE, payload: error });


export const authenticate = (login, password) => {
    return (dispatch, getState) => {
        let config = { params: { login, password } };
        dispatch(signin_user());
        return axios.get(`${apiUrl}/auth`, config)
            .then(function (response) {
                userSchema.isValid(response.data).then((valid) => {
                    valid ? dispatch(signin_success(response.data)) : dispatch(signin_failed({ header: "Erreur!", message: 'Réponse invalide' }));
                });
            })
            .catch(function (error) {
                if (!error.response)
                    dispatch(signin_failed({ header: "Erreur!", message: error.message }));
                else if (error.response.status === 401)
                    dispatch(signin_failed({ header: "L'authentification a échoué!", message: error.response.data.log }));
                else
                    dispatch(signin_failed({ header: "L'authentification a échoué!", message: error.response.statusText }));
            })
    }
}


// /api/me
export const me = () => {
    return (dispatch, getState) => {
        let sessionId = localStorage.getItem('x-token');
        let config = { headers: { 'Authorization': "Bearer " + sessionId } };

        dispatch(signin_user());
        return axios.get(`${apiUrl}/me`, config)
            .then(response => {
                meSchema.isValid(response.data).then((valid) => {
                    valid ? dispatch(signin_success({ sessionId, ...response.data })) : dispatch(signin_failed({ header: "Erreur!", message: 'Réponse invalide' }));
                });
            })
            .catch(error => {
                dispatch(signin_reset());
            })
    };
};



// /api/1.0/changepassword
export const change_password = (password, token = null) => {
    return (dispatch, getState) => {
        let superToken = true;
        if (token == null) {
            token = localStorage.getItem('x-token');
            superToken = false;
        }
        let config = {
            params: { password },
            headers: { 'Authorization': "Bearer " + token } };

        return axios.get(`${apiUrl}/changepassword`, config)
            .then(response => {
                userSchema.isValid(response.data).then( (valid) => {
                    if (superToken === true)
                        valid ? dispatch(signin_success(response.data)) : dispatch(signin_failed({ header: "Erreur!", message: 'Réponse invalide' }));
                    else
                        dispatch(signin_success(response.data));
                });
            })
            .catch(error => {
                if (!error.response)
                    dispatch(signin_failed({ header: "Erreur!", message: error.message }));
                else if (error.response.status === 401)
                    dispatch(signin_failed({ header: "L'authentification a échoué!", message: error.response.data.log }));
                else
                    dispatch(signin_failed({ header: "L'authentification a échoué!", message: error.response.statusText }));
            })
        };
    };


// /riddle
export const riddle = (login) => {
    return (dispatch, getState) => {
        let config = {
            params: { login }
        };

        const p = new Promise((resolve, reject) => {
            axios.get(`${apiUrl}/riddle`, config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};


// /resetpassword
export const reset_password = (login, email) => {
    return (dispatch, getState) => {
        let config = {
            params: { login, email }
        };

        const p = new Promise((resolve, reject) => {
            axios.get(`${apiUrl}/resetpassword`, config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};
