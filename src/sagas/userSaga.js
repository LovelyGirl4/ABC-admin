import { put, take, call, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { message } from 'antd';
import * as ActionTypes from '../constants/ActionTypes';
import * as api from '../api';
import { onChange, complete } from '../actions/formAction';

export function * fetchUserList(pagination) {
    try {
        const data = yield call(api.fetchUserList, pagination);
        yield put({ type: ActionTypes.FETCH_USER_LIST_SUCCESS, dataSource: data.admins });
    } catch (e) {
        yield put({ type: ActionTypes.FETCH_USER_LIST_ERROR });
    }
}

function * uploadAvator(name, url, formName) {
    // const avator = yield api.uploadFile(files);
    yield put(onChange(formName)({ target: { name: name, value: url } }));
}

function * createUser(user) {
    try {
        yield call(api.createUser, user);
        yield put(push('/user/user-list'));
        yield put({ type: ActionTypes.CREATE_USER_SUCCESS});
        message.success('添加业务员成功');
    } catch (e) {
        message.error(`添加业务员失败, ${e.status}, ${e.statusText}`);
        console.error(e);
    }
}

function * fetchProfile() {
    try {
        const profile = yield call(api.fetchProfile);
        yield put(complete('profile')(profile));
    } catch (e) {
        console.error(e);
    }
}

function * updateProfile(profile) {
    try {
        const data = yield call(api.updateUser, profile);
        yield put(complete('profile')(data));
        message.success('更新业务员成功');
    } catch (e) {
        message.error(`更新业务员失败, ${e.status}, ${e.statusText}`);
        console.error(e);
    }
}

function * changePassword(email) {
    try {
        yield call(api.changePassword, email);
    } catch (e) {
        console.error(e);
    }
}

export default {
    watchUserStatus: function * () {
        while (true) {
            const { user, index } = yield take(ActionTypes.USER_STATUS_CHANGE);
            const data = yield call(api.updateUser, { ...user });
            yield call(fetchUserList);
            message.success('成功');
        }
    },
    watchUploadAvator: function * () {
        while (true) {
            const { name, url, formName } = yield take(ActionTypes.UPLOAD_AVATOR);
            yield call(uploadAvator, name, url, formName);
        }
    },
    watchFetchUserList: function * () {
        while (true) {
            const { pagination } = yield take(ActionTypes.FETCH_USER_LIST);
            yield call(fetchUserList, pagination);
        }
    },
    watchCreateUser: function * () {
        while (true) {
            const { user } = yield take(ActionTypes.CREATE_USER);
            yield call(createUser, user);
        }
    },
    watchFetchProfile: function * () {
        while (true) {
            yield take(ActionTypes.FETCH_PROFILE);
            yield call(fetchProfile);
        }
    },
    watchUpdateProfile: function * () {
        while (true) {
            const { profile } = yield take(ActionTypes.UPDATE_PROFILE);
            yield call(updateProfile, profile);
        }
    },
    watchChangePassword: function * () {
        while (true) {
            const { email } = yield take(ActionTypes.CHANGE_PASSWORD);
            yield call(changePassword, email);
        }
    }
};
