import * as ActionTypes from '../constants/ActionTypes';

export const changeLanguage = locale => ({
    type: ActionTypes.CHANGE_LANGUAGE,
    locale,
});
