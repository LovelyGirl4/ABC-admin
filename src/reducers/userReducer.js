import { combineReducers } from 'redux';
import { FETCH_USER_LIST, FETCH_USER_LIST_ERROR, FETCH_USER_LIST_SUCCESS } from '../constants/ActionTypes';
import { createAsyncUIReducer } from '../common';

const initialState = {
    data: {
        dataSource: [],
        pagination: {
            current: 1,
            pageSize: 100,
            total: 100,
        }
    }
};

const data = (state = initialState.data, a) => {
    let nextState;
    switch (a.type) {
        case FETCH_USER_LIST_SUCCESS:
            nextState = {
                ...state,
                dataSource: a.dataSource,
            };
            break;
        default:
            nextState = { ...state };
            break;
    }
    return nextState;
};

const ui = createAsyncUIReducer({
    fetching: FETCH_USER_LIST,
});

export default combineReducers({
    data,
    ui,
});
