import pathTypes from "./pathTypes";

const INITIAL_STATE = {
    currentPath: null
};

const pathReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case pathTypes.SET_CURRENT_PATH:
            return {
                ...state,
                currentPath: action.payload
            };
        default:
            return state;
    };
};

export default pathReducer;