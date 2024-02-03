import {
    APP_TITLE
} from '../constants/index';

const INITIAL_STATE = {
    title: "home"
};

export default function register(state = INITIAL_STATE, action) {
    switch (action.type) {
        case APP_TITLE:
            return {
                ...state, title: action.payload
            };
        default:
            return state;
    }
}
