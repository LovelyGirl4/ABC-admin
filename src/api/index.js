import fetch from 'isomorphic-fetch';
import store from '../store';
// 测试
// let API_DOMAIN = 'http://api.test.autopartshub.com';

let API_DOMAIN;
let API_CLIENT_ID;

if (process.env.NODE_ENV === 'development') {
    // API_DOMAIN = 'http://g-will-api.obenben.com';
    API_DOMAIN = 'http://api.test.autopartshub.com';
    API_CLIENT_ID = 'admin';
} else if (process.env.NODE_ENV === 'production') {
    // API_DOMAIN = 'http://g-will-api.obenben.com';
    API_DOMAIN = 'http://api.autopartshub.com';
    API_CLIENT_ID = 'admin';
}
if (process.env.DEPLOY_ENV === 'test') {
    API_DOMAIN = 'http://api.test.autopartshub.com';
    API_CLIENT_ID = 'admin';
}

export {API_DOMAIN, API_CLIENT_ID};

const serialize = obj => Object.keys(obj).map(key => key + '=' + encodeURIComponent(obj[key])).join('&');

const _fetch = (url, option = {}) => {
    return fetch(API_DOMAIN + url, option).then(res => {
        if (res.status > 199 && res.status < 300 || res.status == 409) {
            return res;
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
    }).then(res => {
        if (res.status === 204 || res.status === 205) {
            return {};
        }
        return res.json();
    });
};

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
            client_secret: '',
            scope: ''
        })
    }).then(res => res.json());
};

export const fetchProfile = () => {
    const access_token = store.getState().app.token;
    const id = JSON.parse(atob(access_token.split('.')[1])).sub;
    return _authFetchJson('/api/users/' + id);
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

export const fetchCustomerList = (pagination, firstName, surName, companyName, status, profile) => {
    const newPagination = pagination ? pagination : {current: 1};
    const first_name = firstName || '';
    const surname = surName || '';
    const company_name = companyName || '';
    if (profile.role === 'webmaster') {
        return _authFetchJson(`/api/customers?waiter_id=${profile.user_id}&page=${newPagination.current}&first_name=${first_name}&surname=${surname}&company_name=${company_name}&state=${status || ''}`);
    }
    return _authFetchJson(`/api/customers?page=${newPagination.current}&first_name=${first_name}&surname=${surname}&company_name=${company_name}&state=${status || ''}`);
};

export const fetchCustomer = id => {
    return _authFetchJson(`/api/customers/${id}`);
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
