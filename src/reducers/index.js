import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { AUTHENTICATED_SUCCESS, CHANGE_LANGUAGE } from '../constants/ActionTypes';
import login from './login';
import user from './userReducer';
import customer from './customerReducer';
import form from './formReducer';
import history from './historyReducer';

import { getDefaultLocale, getToken } from '../common';

const locale = getDefaultLocale();

const initialState = {
    token: getToken(),
    locale,
};

const app = (state = initialState, a) => {
    let nextState = {};
    switch (a.type) {
        case AUTHENTICATED_SUCCESS:
            nextState = { ...state, token: a.token };
            break;
        case CHANGE_LANGUAGE:
            nextState = { ...state, locale: a.locale };
            break;
        default:
            nextState = { ...state };
            break;
    }
    return nextState;
};

export default combineReducers({
    app,
    history,
    login,
    user,
    customer,
    form,
    router: routerReducer,
});
