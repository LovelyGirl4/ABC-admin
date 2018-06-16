import { combineReducers } from 'redux';
import { FETCH_LINE_CHART, FETCH_LINE_CHART_SUCCESS, FETCH_COLUMN_CHART, FETCH_COLUMN_CHART_SUCCESS } from '../constants/ActionTypes';
import { createAsyncUIReducer } from '../common';

const initialState = {
    line: [],
    column: []
};

const data = (state = initialState, action) => {
    let nextState;
    switch (action.type) {
        case FETCH_LINE_CHART_SUCCESS:
            nextState = {
                ...state,
                line: action.data
            };
            break;
        case FETCH_COLUMN_CHART_SUCCESS:
            nextState = {
                ...state,
                column: action.data
            };
            break;
        default:
            nextState = { ...state };
            break;
    }
    return nextState;
};

const ui = createAsyncUIReducer({
    lineChartFetching: FETCH_LINE_CHART,
    columnChartFetching: FETCH_COLUMN_CHART,
});

export default combineReducers({
    data,
    ui,
});
