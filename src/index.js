import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './containers/App';

const ele = document.getElementById('app');

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    ele
);
