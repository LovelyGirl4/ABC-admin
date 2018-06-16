import { put, take, call, select } from 'redux-saga/effects';
import { message } from 'antd';
import { FETCH_LOGIN, LOGIN, AUTHENTICATED_SUCCESS, FETCH_LOGIN_SUCCESS, TOKEN_LOGIN, TOKEN_LOGIN_SUCCESS } from '../constants/ActionTypes';
import { push } from 'react-router-redux';
import { fetchLogin, fetchProfile } from '../api';

function * tokenLogin() {
    try {
        const {user} = yield call(fetchProfile);
        console.log('feedback:', user);
        yield put({ type: TOKEN_LOGIN_SUCCESS, profile: user });
    } catch (e) {
        console.log(e);
    }
}

function * login(username, password) {
    const { messages } = yield select(state => state.app.locale);
    try {
        yield put({ type: FETCH_LOGIN, fetching: true });
        const { access_token } = yield call(fetchLogin, username, password);
        window.localStorage.setItem('token', access_token);
        yield put(push('/'));
        // 将token存到store中
        yield put({ type: AUTHENTICATED_SUCCESS, token: access_token });
        try {
            const profile = yield call(fetchProfile);
            yield put({type: FETCH_LOGIN_SUCCESS, profile: profile});
            // if ((profile.role === 'super_admin' || profile.role === 'webmaster') && profile.is_active) {
            //     const { from } = yield select(state => state.router.location.state || { from: { pathname: '/' } });
            //     yield put(push(from.pathname));
            //     const { token } = yield select(state => state.app);
            //     // 将token存进localStorage
            //     window.localStorage.setItem('token', token);
            // } else {
            //     throw { msg: messages['GlobalMessage.NotPermission'], profile };
            // }
        } catch (error) {
            yield put({ type: AUTHENTICATED_SUCCESS, token: null });
            message.error(error.msg);
        }
    } catch (error) {
        message.error(messages['GlobalMessage.AuthError']);
    } finally {
        yield put({ type: FETCH_LOGIN, fetching: false });
    }
}

export default {
    watchLogin: function * (store) {
        while (true) {
            const { username, password } = yield take(LOGIN);
            const token = yield call(login, username, password, store);
        }
    },
    watchTokenLogin: function * () {
        while (true) {
            yield take(TOKEN_LOGIN);
            yield call(tokenLogin);
        }
    }
};
