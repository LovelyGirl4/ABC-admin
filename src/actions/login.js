import { LOGIN_FORM_CHANGE, LOGIN, TOKEN_LOGIN } from '../constants/ActionTypes';

export const loginFormChange = (formField, value) => ({
    type: LOGIN_FORM_CHANGE,
    formField,
    value,
});

export const fetchLogin = (username, password) => ({
    type: LOGIN,
    username,
    password,
});

export const fetchTokenLogin = () => ({
    type: TOKEN_LOGIN
});
