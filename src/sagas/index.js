import { fork, take } from 'redux-saga/effects';
import loginSagas from './login';
import userSagas from './userSaga';
import customerSagas from './customerSaga';
import historySagas from './historySaga';

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
    yield createSagas(loginSagas, userSagas, customerSagas, historySagas);
}
