import {FETCH_LINE_CHART, FETCH_COLUMN_CHART} from '../constants/ActionTypes';

export const fetchLineChart = param => ({
    type: FETCH_LINE_CHART,
    param,
});

export const fetchColumnChart = param => ({
    type: FETCH_LINE_CHART,
    param,
});
