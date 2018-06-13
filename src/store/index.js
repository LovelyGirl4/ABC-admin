import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import reducer from '../reducers';
import rootSagas from '../sagas';

const debug = process.env.NODE_ENV === 'development';

export const history = createHistory({ basename: '/' });
let sagaMiddleware = createSagaMiddleware();
let middleware = debug ? applyMiddleware(require('redux-logger').createLogger(), sagaMiddleware, routerMiddleware(history)) :
    applyMiddleware(sagaMiddleware, routerMiddleware(history));
export default createStore(reducer, middleware);
sagaMiddleware.run(rootSagas);
