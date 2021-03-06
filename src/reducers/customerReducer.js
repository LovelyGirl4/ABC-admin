import { combineReducers } from 'redux';
import * as ActionTypes from '../constants/ActionTypes';
import { createAsyncUIReducer } from '../common';

const initialState = {
    data: {
        dataSource: [],
        page: {
            current_page: 1,
            total_count: 0
        },
        customer: {},
        exam: []
    },
};

const data = (state = initialState.data, a) => {
    let nextState;
    switch (a.type) {
        case ActionTypes.FETCH_CUSTOMER_LIST_SUCCESS:
            nextState = {
                ...state,
                dataSource: a.data,
                page: a.page || { current_page: 1, total_count: 0}
            };
            break;
        case ActionTypes.FETCH_SURVEY_RESULT_SUCCESS:
            nextState = {
                ...state,
                exam: a.data
            };
            break;
        case ActionTypes.FETCH_CUSTOMER_SUCCESS:
            nextState = {
                ...state,
                customer: a.data
            };
            break;
        default:
            nextState = { ...state };
            break;
    }
    return nextState;
};

const ui = createAsyncUIReducer({
    fetching: ActionTypes.FETCH_CUSTOMER_LIST,
    clientFetching: ActionTypes.FETCH_WEBMASTER_CUSTOMER,
    // updateFetching: ActionTypes.UPDATE_CUSTOMER,
    customerFetching: ActionTypes.FETCH_CUSTOMER,
});

export default combineReducers({
    data,
    ui,
});
