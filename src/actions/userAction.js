import * as ActionTypes from '../constants/ActionTypes';

export const fetchUserList = pagination => ({
    type: ActionTypes.FETCH_USER_LIST,
    pagination,
});

export const createUser = user => ({
    type: ActionTypes.CREATE_USER,
    user,
});

export const uploadAvator = (name, url, formName) => ({
    type: ActionTypes.UPLOAD_AVATOR,
    name,
    url,
    formName,
});

export const updateUser = (user, index) => ({
    type: ActionTypes.USER_STATUS_CHANGE,
    user,
    index,
});

export const fetchProfile = () => ({ type: ActionTypes.FETCH_PROFILE });

export const fetchUser = id => ({
    type: ActionTypes.FETCH_USER,
    id,
});


export const updateProfile = (profile) => ({
    type: ActionTypes.UPDATE_PROFILE,
    profile,
});

export const changePassword = email => ({
    type: ActionTypes.CHANGE_PASSWORD,
    email,
});
