import { combineReducers } from 'redux';
import * as ActionTypes from '../constants/ActionTypes';
import { createAsyncUIReducer } from '../common';

const initialState = {
    data: {
        dataSource: [],
        current_page: 1,
        total_count: 0,
        page_size: 0,
    },
};

const data = (state = initialState.data, a) => {
    let nextState;
    switch (a.type) {
        case ActionTypes.FETCH_CUSTOMER_LIST_SUCCESS:
            nextState = {
                ...state,
                dataSource: a.dataSource,
                current_page: a.current_page,
                total_count: a.total_count
            };
            break;
        case ActionTypes.UPDATE_CUSTOMER_SUCCESS:
            var customers = state.dataSource.map((item) => {
                if (item.id === a.data.id) {
                    return {...a.data};
                } else {
                    return item;
                }
            });
            nextState = {
                ...state,
                dataSource: customers
            };
            break;
        case ActionTypes.FETCH_WEBMASTER_CUSTOMER_SUCCESS:
            nextState = {
                ...state,
                dataSource: a.customers,
                current_page: a.current_page,
                total_count: a.total_count,
                page_size: a.page_size
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
