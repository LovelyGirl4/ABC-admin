import { fork, take } from 'redux-saga/effects';
import loginSagas from './loginSaga';
import userSagas from './userSaga';
import customerSagas from './customerSaga';
import chartSagas from './chartSaga';

function createSagas(...args) {
    const sagas = [];
    args.forEach(el => {
        for (let func of Object.values(el)) {
            sagas.push(fork(func));
        }
    });
    return sagas;
}

export default function * root() {
    yield createSagas(loginSagas, userSagas, customerSagas, chartSagas);
}
