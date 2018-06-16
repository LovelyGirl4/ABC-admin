import { combineReducers } from 'redux';
import { LOGIN_FORM_CHANGE, FETCH_LOGIN, FETCH_LOGIN_SUCCESS, TOKEN_LOGIN_SUCCESS} from '../constants/ActionTypes';

const initialState = {
    data: {
        profile: '',
        messages: '',
    },
    form: {
        username: '',
        password: '',
    },
    ui: {
        fetching: false,
    },
};

const data = (state = initialState.data, a) => {
    let nextState;
    switch (a.type) {
        case FETCH_LOGIN:
            nextState = { ...state };
            break;
        case FETCH_LOGIN_SUCCESS:
            nextState = {...state, profile: a.profile, messages: a.messages};
            break;
        case TOKEN_LOGIN_SUCCESS:
            nextState = {...state, profile: a.profile, messages: a.messages};
            break;
        default:
            nextState = { ...state };
            break;
    }
    return nextState;
};

const form = (state = initialState.form, a) => {
    let nextState;
    switch (a.type) {
        case LOGIN_FORM_CHANGE:
            nextState = { ...state, [a.formField]: a.value };
            break;
        default:
            nextState = { ...state };
            break;
    }
    return nextState;
};

const ui = (state = initialState.ui, a) => {
    let nextState;
    switch (a.type) {
        case FETCH_LOGIN:
            nextState = { ...state, fetching: a.fetching };
            break;
        default:
            nextState = { ...state };
            break;
    }
    return nextState;
};

export default combineReducers({
    data,
    form,
    ui,
});
