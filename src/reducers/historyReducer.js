import { combineReducers } from 'redux';
import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
    history: ''
};

const history = (state = initialState, a) => {
    let nextState = {};
    switch (a.type) {
        case ActionTypes.ADD_HISTORY_SUCCESS:
            nextState = { ...state, history: a.history };
            break;
        default:
            nextState = { ...state };
            break;
    }
    return nextState;
};

export default combineReducers({
    history
});
