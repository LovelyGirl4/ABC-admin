import fetch from 'isomorphic-fetch';
import store from '../store';
// 测试
// let API_DOMAIN = 'http://api.test.autopartshub.com';

let API_DOMAIN = 'http://qapi.obenben.com';
let API_CLIENT_ID = 'app';

// if (process.env.NODE_ENV === 'development') {
//     // API_DOMAIN = 'http://g-will-api.obenben.com';
//     API_DOMAIN = 'http://api.test.autopartshub.com';
//     API_CLIENT_ID = 'admin';
// } else if (process.env.NODE_ENV === 'production') {
//     // API_DOMAIN = 'http://g-will-api.obenben.com';
//     API_DOMAIN = 'http://api.autopartshub.com';
//     API_CLIENT_ID = 'admin';
// }
// if (process.env.DEPLOY_ENV === 'test') {
//     API_DOMAIN = 'http://api.test.autopartshub.com';
//     API_CLIENT_ID = 'admin';
// }

export {API_DOMAIN, API_CLIENT_ID};

const serialize = obj => Object.keys(obj).map(key => key + '=' + encodeURIComponent(obj[key])).join('&');

const _fetch = (url, option = {}) => {
    return fetch(API_DOMAIN + url, option).then(res => {
        if (res.status > 199 && res.status < 300 || res.status == 409) {
            return res.json();
        } else {
            throw res;
        }
    });
};

const _fetchJson = (url, option = {}) => {
    return _fetch(url, {
        ...option,
        headers: {
            ...option.headers,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());
};

const _authFetchJson = (url, option = {}) => {
    const access_token = store.getState().app.token;
    return _fetch(url, {
        ...option,
        headers: {
            ...option.headers,
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        }
    });
};

// 用户登录
export const fetchLogin = (username, password) => {
    return _fetch('/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: serialize({
            username,
            password,
            grant_type: 'password',
            client_id: API_CLIENT_ID,
            client_secret: 'secret',
            scope: ''
        })
    });
};

// 获取用户自己的信息
export const fetchProfile = () => {
    const access_token = store.getState().app.token;
    const id = JSON.parse(atob(access_token.split('.')[1])).sub;
    return _authFetchJson(`/api/users/${id}`);
};

// 获取客户列表
export const fetchCustomerList = (page = 1, page_size = 10) => {
    return _authFetchJson(`/api/exam?page=${page}&page_size=${page_size}`);
};

// 获取客户详情
export const fetchCustomer = id => {
    return _authFetchJson(`/api/users/${id}`);
};

// 获取单个客户问卷调查结果
export const fetchSurveyResult = (id) => {
    return _authFetchJson(`/api/users/${id}/exams`);
};

// 获取折线图数据
export const fetchLineChart = () => {
    return _authFetchJson('/api/abcusers?action=login_abc');
};

// 获取柱形图数据
export const fetchColumnChart = () => {
    return _authFetchJson('/api/abcexamusers');
};


export const fetchUserList = pagination => {
    return _authFetchJson('/api/admins');
};

export const updateUser = user => {
    return _authFetchJson(`/api/admins/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify(user)
    });
};

export const createUser = user => {
    return _authFetchJson('/api/admins', {
        method: 'POST',
        body: JSON.stringify(user)
    });
};

export const changePassword = email => {
    return _authFetchJson('/api/password', {
        method: 'POST',
        body: JSON.stringify({client_id: API_CLIENT_ID, email})
    });
};

export const uploadFile = files => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('http://img05.tooopen.com/images/20160121/tooopen_sy_155168162826.jpg');
        }, 1000);
    });
};

export const updateCustomer = customer => {
    return _authFetchJson(`/api/customers/${customer.id}`, {
        method: 'PATCH',
        body: JSON.stringify(customer)
    });
};

export const getUploadConfig = (dir) => {
    return _authFetchJson(`/api/s3-upload/config?resource=${dir.resource}&id=${dir.id}&type=${dir.type}`, {method: 'GET'});
};

export const uploadFiles = (data) => {
    return fetch('http://gw-s3-dev.s3.amazonaws.com/', {
        method: 'POST',
        mode: 'cors',
        body: data
    }).then(res => {
        if (res.status > 199 && res.status < 300) {
            return res.url;
        } else {
            throw res;
        }
    });
};
