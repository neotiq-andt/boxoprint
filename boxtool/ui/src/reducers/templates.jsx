import {
    LOGOUT_USER,
    TEMPLATES_INIT,
    TEMPLATES_SUCCESS,
    TEMPLATES_FAILURE,
} from '../constants/index';

const INITIAL_STATE = {
    error: null, loading: false, completed: true, templates: []
};

export default function register(state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOGOUT_USER:
            return { ...state, loading: true, error: null, templates: []};
        case TEMPLATES_INIT:
            return { ...state, loading: true, error: null };
        case TEMPLATES_SUCCESS:
            const templates = Object.keys(action.payload).map(function (key, index) {
                return ({name: key, ...action.payload[key]});
            });
            return { ...state, loading: false, error: null, templates };
        case TEMPLATES_FAILURE:
            return { ...state, loading: false, error: { header: action.payload.header, message: action.payload.message } };
        default:
            return state;
    }
}
