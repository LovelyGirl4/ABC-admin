import { put, take, call, select } from 'redux-saga/effects';
import * as ActionTypes from '../constants/ActionTypes';

export function * addHistory(history) {
    try {
        yield put({type: ActionTypes.ADD_HISTORY_SUCCESS, history: history});
    } catch (e) {
        yield put({ type: ActionTypes.ADD_HISTORY_ERROR });
        console.error(e);
    }
}

export default {
    watchAddHistory: function * () {
        while (true) {
            const { history } = yield take(ActionTypes.ADD_HISTORY);
            yield call(addHistory, history);
        }
    }
};
