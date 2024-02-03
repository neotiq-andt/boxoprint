import { combineReducers } from 'redux';

import session from './session';
import templates from './templates';
import metadata from './metadata';
import editor from './editor';


const reducers = combineReducers({
    session,
    templates,
    metadata,
    editor,
});

export default reducers;