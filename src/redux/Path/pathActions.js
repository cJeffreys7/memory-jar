import pathTypes from "./pathTypes";

export const setCurrentPath = path => ({
    type: pathTypes.SET_CURRENT_PATH,
    payload: path
});