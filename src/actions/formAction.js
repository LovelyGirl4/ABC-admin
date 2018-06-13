import { createResetFormActionWithFormName, createFormActionWithFormName, createCompleteFormActionWithFormName } from '../common';
import { UPDATE_WAITER } from '../constants/ActionTypes';
export const onChange = createFormActionWithFormName;
export const reset = createResetFormActionWithFormName;
export const complete = createCompleteFormActionWithFormName;
export const updateWaiter = (formName, name, value) => ({
    type: UPDATE_WAITER,
    formName,
    name,
    value,
});
