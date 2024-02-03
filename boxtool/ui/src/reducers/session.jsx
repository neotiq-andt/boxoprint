import {
    LOGOUT_USER,
    SIGNIN_USER,
    SIGNIN_USER_SUCCESS,
    SIGNIN_USER_FAILURE,
    SIGNIN_USER_RESET,
} from '../constants/index';

const INITIAL_STATE = {
    error: null, loading: false, completed: true, user: {
        id: 0,
        login: '',
        role: "none",
        superToken: ''
    }
};

export default function register(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SIGNIN_USER:
            return { ...state, loading: true, error: null, user: { login: "", id: 0, role: 'none', superToken: '' } };
        case SIGNIN_USER_SUCCESS:
            localStorage.setItem('x-token', action.payload.sessionId);
            return { ...state, loading: false, completed: true, error: null, user: { login: action.payload.login, id: 1, role: action.payload.role, superToken: action.payload.superToken } };
        case SIGNIN_USER_FAILURE:
            localStorage.removeItem('x-token');
            return { ...state, loading: false, completed: true, error: { header: action.payload.header, message: action.payload.message }, user: { login: '', id: 0, role: 'none', superToken: '' } };

        case LOGOUT_USER:
            localStorage.removeItem('x-token');
            // fallsthrough
        case SIGNIN_USER_RESET:
            return { ...state, loading: false, completed: true, error: null, user: { login: "", id: 0, role: 'none', superToken: '' } };
        default:
            return state;
    }
}
