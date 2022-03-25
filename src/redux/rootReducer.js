import { combineReducers } from 'redux';

import userReducer from './User/userReducer';
import memoryJarReducer from './MemoryJar/memoryJarReducer';
import pathReducer from './Path/pathReducer';

export default combineReducers({
    user: userReducer,
    memoryJar: memoryJarReducer,
    path: pathReducer
})