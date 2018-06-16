import { put, take, call, select } from 'redux-saga/effects';
import { message } from 'antd';
import { FETCH_LINE_CHART, FETCH_LINE_CHART_SUCCESS, FETCH_LINE_CHART_ERROR,
    FETCH_COLUMN_CHART, FETCH_COLUMN_CHART_SUCCESS, FETCH_COLUMN_CHART_ERROR } from '../constants/ActionTypes';
import { push } from 'react-router-redux';
import { fetchLogin, fetchProfile, fetchLineChart, fetchColumnChart } from '../api';

function * fetchLineChartFunc() {
    try {
        const {statistics_users} = yield call(fetchLineChart);
        yield put({ type: FETCH_LINE_CHART_SUCCESS, data: statistics_users});
    } catch (e) {
        console.log(e);
        yield put({ type: FETCH_LINE_CHART_ERROR});
    }
}

function * fetchColumnChartFunc() {
    try {
        const {statistics_exam_users} = yield call(fetchColumnChart);
        yield put({ type: FETCH_COLUMN_CHART_SUCCESS, data: statistics_exam_users});
    } catch (e) {
        console.log(e);
        yield put({ type: FETCH_COLUMN_CHART_ERROR});
    }
}


export default {
    watchFetchLineChart: function * (store) {
        while (true) {
            const { param } = yield take(FETCH_LINE_CHART);
            yield call(fetchLineChartFunc, param);
        }
    },
    watchFetchColumnChart: function * (store) {
        while (true) {
            const { param } = yield take(FETCH_COLUMN_CHART);
            yield call(fetchColumnChartFunc, param);
        }
    }
};
