import {
    EDITOR_SHOW_HELPERS,
    EDITOR_HIDE_HELPERS,
} from '../constants/index';

const INITIAL_STATE = {
    helpers: true
};

export default function register(state = INITIAL_STATE, action) {
    switch (action.type) {
        case EDITOR_SHOW_HELPERS:
            return {
                ...state, helpers: true
            };
        case EDITOR_HIDE_HELPERS:
            return {
                ...state, helpers: false
            };
        default:
            return state;
    }
}
