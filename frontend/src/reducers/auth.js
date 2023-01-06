import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS, REGISTER_FAIL
} from "../actions/types";


const initialState = {
    access_token: localStorage.getItem("access"),
    refresh_token: localStorage.getItem("refresh"),
    isAuthenticated: null,
    isLoading: false,
    user: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem("access_token", action.payload.access);
            localStorage.setItem("refresh_token", action.payload.refresh);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case REGISTER_FAIL:
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            return {
                ...state,
                access_token: null,
                refresh_token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };
        case LOGOUT_SUCCESS:
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            return {
                ...state,
                leads: [],
                access_token: null,
                refresh_token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };

        default:
            return state;
    }
}