import { put, take, call, select, fork, cancel } from 'redux-saga/effects';
import { message } from 'antd';
import * as ActionTypes from '../constants/ActionTypes';
import * as api from '../api';
import { complete } from '../actions/formAction';
import { onChange } from '../actions/formAction';

export function * fetchCustomerList (pagination, firstName, surName, companyName, status) {
    try {
        // const profile = yield select(state => state.login.data.profile);
        const response = yield call(api.fetchCustomerList);
        const {page, users, wx_profiles} = response;
        console.log('response:', response);
        const data = users && users.map(u => {
            const profile = wx_profiles.filter(wx => wx.unionid === u.unionid)[0];
            return {
                ...profile,
                id: u.id,
                mobile: u.mobile
            };
        });
        yield put({ type: ActionTypes.FETCH_CUSTOMER_LIST_SUCCESS, data, page});
    } catch (e) {
        console.error(e);
        yield put({ type: ActionTypes.FETCH_CUSTOMER_LIST_ERROR });
    }
}

function * fetchCustomer (id) {
    try {
        const {user, wx_profile} = yield call(api.fetchCustomer, id);
        yield put({ type: ActionTypes.FETCH_CUSTOMER_SUCCESS, data: {
            ...wx_profile,
            id: user.id,
            mobile: user.mobile,
            role: user.role
        }});
    } catch (e) {
        console.error(e);
        yield put({ type: ActionTypes.FETCH_CUSTOMER_LIST_ERROR });
    }
}

function * updateCustomer (customer) {
    try {
        const data = yield call(api.updateCustomer, customer);
        // yield put(complete('customer')(data));
        yield put({ type: ActionTypes.UPDATE_CUSTOMER_SUCCESS, data });
        message.success('更新客户信息成功');
    } catch (e) {
        message.error(`更新客户信息失败, ${e.status}, ${e.statusText}`);
        console.error(e);
        yield put({ type: ActionTypes.UPDATE_CUSTOMER_ERROR });
    }
}

function * updateWaiter (formName, name, value) {
    try {
        yield put(onChange(formName)({ target: { name: name, value: value } }));
        yield put({ type: ActionTypes.UPDATE_WAITER_SUCCESS });
    } catch (e) {
        console.error(e);
        yield put({ type: ActionTypes.UPDATE_WAITER_ERROR });
    }
}

export function * fetchWebmasterCustomer(state, role, pagination) {
    try {
        const {customers, total_count, current_page, page_size} = yield call(api.fetchWebmasterCustomer, state, role, pagination);
        let arr = [];
        let customersID = [];
        // 并发调接口，获取每个客户询价的值
        for (let c of customers) {
            customersID.push(c.user_id);
            arr.push(call(api.fetchCustomerInquiryList, state, c.user_id));
        }
        const inquiryList = yield arr;
        // 将total_count写进customerList
        const customerList = customers.map(cus => {
            let customer;
            for (let i = 0; i < customersID.length; i++) {
                if (cus.user_id === customersID[i]) {
                    customer = {...cus, number: inquiryList[i].total_count};
                }
            }
            return customer;
        });
        yield put({ type: ActionTypes.FETCH_WEBMASTER_CUSTOMER_SUCCESS, customers: customerList, total_count, current_page, page_size});
    } catch (e) {
        yield put({ type: ActionTypes.FETCH_WEBMASTER_CUSTOMER_ERROR });
    }
}

export function * fetchSurveyResultFunc (id) {
    try {
        const {ExamsProfile} = yield call(api.fetchSurveyResult, id);
        const {answers, exam, questions} = ExamsProfile;
        const newQuestions = questions.map(q => {
            const answer = answers.filter(a => a.question_id === q.id)[0];
            return {id: q.id, question: q.content, answer: answer.content, exam_id: q.exam_id};
        });
        const data = exam.map(e => {
            return {
                ...e,
                questions: newQuestions.filter(n => n.exam_id === e.id)
            };
        });
        console.log('fetchSurveyResult data:', data);
        yield put({ type: ActionTypes.FETCH_SURVEY_RESULT_SUCCESS, data: data });
    } catch (e) {
        console.error(e);
        yield put({ type: ActionTypes.FETCH_SURVEY_RESULT_ERROR });
    }
}

export default {
    watchFetchCustomerList: function * () {
        while (true) {
            const { pagination, firstName, surName, companyName, status } = yield take(ActionTypes.FETCH_CUSTOMER_LIST);
            yield call(fetchCustomerList, pagination, firstName, surName, companyName, status);
        }
    },
    watchFetchCustomer: function * () {
        while (true) {
            const { id } = yield take(ActionTypes.FETCH_CUSTOMER);
            yield call(fetchCustomer, id);
        }
    },
    watchUpdateCustomer: function * () {
        while (true) {
            const { customer } = yield take(ActionTypes.UPDATE_CUSTOMER);
            yield call(updateCustomer, customer);
        }
    },
    watchUpdateWaiter: function * () {
        while (true) {
            const {formName, name, value} = yield take(ActionTypes.UPDATE_WAITER);
            yield call(updateWaiter, formName, name, value);
        }
    },
    watchFetchWebmasterCustomer: function * () {
        let lastTask;
        while (true) {
            const {state, role, pagination} = yield take(ActionTypes.FETCH_WEBMASTER_CUSTOMER);
            if (lastTask) {
                yield cancel(lastTask);
            }
            lastTask = yield fork(fetchWebmasterCustomer, state, role, pagination);
        }
    },
    watchFetchSurveyResult: function * () {
        while (true) {
            const { id } = yield take(ActionTypes.FETCH_SURVEY_RESULT);
            yield call(fetchSurveyResultFunc, id);
        }
    },
};
