import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';

import { LocaleProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import { changeLanguage } from '../actions';
import { fetchTokenLogin } from '../actions/login';

import { history } from '../store';
import NotFound from './NotFound';
import Login from './Login';
import Navbar from '../components/Navbar';

import UserList from './User/UserList';
import AddUser from './User/AddUser';

import Profile from './Profile';
import Messages from './Messages';

import CustomerList from './Customer/CustomerList';
import Customer from './Customer/Customer';

const Home = () => (<div>Home</div>);

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
    <Route {...rest} render={props => (
        isAuthenticated ? (
            <Navbar {...props} {...rest}>
                <Component {...props}/>
            </Navbar>
        ) : (
            <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }}/>
        )
    )}/>
);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsedSider: false,
        };
    }
    onCollapseSider = (collapsedSider) => {
        this.setState({ collapsedSider });
    }
    componentDidMount() {
        this.props.fetchTokenLogin();
    }
    render() {
        const { token, locale } = this.props.app;
        const {collapsedSider} = this.state;
        return <LocaleProvider locale={locale.antd}>
            <IntlProvider locale={locale.locale} messages={locale.messages}>
                <Router history={history}>
                    <Switch>
                        <PrivateRoute
                            exact
                            path='/'
                            component={Home}
                            isAuthenticated={token}
                            collapsedSider={collapsedSider}
                            {...this.props}
                             onCollapseSider={this.onCollapseSider}
                        />
                        <PrivateRoute
                            exact
                            path='/user/user-list'
                            component={UserList}
                            isAuthenticated={token}
                            {...this.props}
                            collapsedSider={collapsedSider}
                            onCollapseSider={this.onCollapseSider}
                        />
                        <PrivateRoute
                            exact
                            path='/user/add'
                            component={AddUser}
                            isAuthenticated={token}
                            {...this.props}
                            collapsedSider={collapsedSider}
                            onCollapseSider={this.onCollapseSider}
                        />
                        <PrivateRoute
                            exact
                            path='/profile'
                            component={Profile}
                            isAuthenticated={token}
                            {...this.props}
                            collapsedSider={collapsedSider}
                            onCollapseSider={this.onCollapseSider}
                        />
                        <PrivateRoute
                            exact
                            path='/messages'
                            component={Messages}
                            isAuthenticated={token}
                            {...this.props}
                            collapsedSider={collapsedSider}
                            onCollapseSider={this.onCollapseSider}
                        />
                        <PrivateRoute
                            exact
                            path='/user/customer-list'
                            component={CustomerList}
                            isAuthenticated={token}
                            {...this.props}
                            collapsedSider={collapsedSider}
                            onCollapseSider={this.onCollapseSider}
                        />
                        <PrivateRoute
                            exact
                            path='/user/customer/:id'
                            component={Customer}
                            isAuthenticated={token}
                            {...this.props}
                            collapsedSider={collapsedSider}
                            onCollapseSider={this.onCollapseSider}
                        />
                        <Route exact path='/login' component={Login}/>
                        <Route component={NotFound}/>
                    </Switch>
                </Router>
            </IntlProvider>
        </LocaleProvider>;
    }
}

export default connect(
    ({ app, login }) => ({
        app: app,
        profile: login.data.profile,
        messages: login.data.messages,
    }),
    { changeLanguage, fetchTokenLogin },
)(App);
