import * as ActionTypes from '../constants/ActionTypes';

export const fetchCustomerList = (pagination, firstName, surName, companyName, status) => ({
    type: ActionTypes.FETCH_CUSTOMER_LIST,
    pagination,
    firstName,
    surName,
    companyName,
    status
});

export const fetchCustomer = id => ({
    type: ActionTypes.FETCH_CUSTOMER,
    id,
});

export const updateCustomer = customer => ({
    type: ActionTypes.UPDATE_CUSTOMER,
    customer,
});

export const fetchWebmasterCustomer = (state, role, pagination) => ({
    type: ActionTypes.FETCH_WEBMASTER_CUSTOMER,
    state,
    role,
    pagination
});

export const fetchSurveyResult = (id) => ({
    type: ActionTypes.FETCH_SURVEY_RESULT,
    id
});
