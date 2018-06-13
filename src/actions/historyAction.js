// 为了记录页面上一次的路由，主要用在添加商品——新增品类——返回
import * as ActionTypes from '../constants/ActionTypes';

export const addHistory = history => ({
    type: ActionTypes.ADD_HISTORY,
    history
});
