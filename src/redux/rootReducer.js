import { combineReducers } from 'redux';

import userReducer from './User/userReducer';
import memoryJarReducer from './MemoryJar/memoryJarReducer';

export default combineReducers({
    user: userReducer,
    memoryJar: memoryJarReducer
})