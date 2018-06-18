import React from 'react';
import { Menu, Layout, Breadcrumb, Button, Row, Col, Affix, Avatar, Icon, Badge, Tooltip, Input } from 'antd';
import { Link } from 'react-router-dom';
import store from '../store';
import LOGO from '../components/img/LOGO.png';
import { baseURL } from '../common';
import styles from './Navbar.css';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

import { FormattedMessage } from 'react-intl';
import zh_CN from '../locale/zh_CN';
import en_US from '../locale/en_US';

const Navbar = props => {
    const adminStyle = props.profile.role === 'super_admin' ? {display: 'block'} : {display: 'none'};
    const role = props.profile.role;
    const {headportrait, username} = props.profile && props.profile;
    let headerWidth = document.body.clientWidth - 200;
    if (props.collapsedSider) {
        headerWidth = '100%';
    }
    const orderUsers = props.orderUsers;
    return <Layout>
        <Header style={{ background: '#fff', padding: 0, position: 'fixed', width: document.body.clientWidth, zIndex: 1000, height: 68, borderBottom: '1px solid #f2f2f2'}}>
            <div style={{ display: 'inline-block', width: document.body.clientWidth }}>
                <div style={{
                    // textAlign: 'center',
                    paddingTop: 10,
                    paddingLeft: 6,
                    width: 200,
                    height: 67,
                    display: 'inline-block',
                    backgroundColor: '#f1f1f1'
                }}>
                    <img src={LOGO} style={{height: 47, width: 180}}/>
                </div>
                <Breadcrumb style={{ display: 'inline-block', position: 'absolute', top: 0}}>
                        <Breadcrumb.Item key='/'><Link to='/' style={{ marginLeft: '16px' }}>ABC</Link></Breadcrumb.Item>
                        {props.location.pathname.split('/').map((el, i) => {
                            const length = props.location.pathname.split('/').length;
                            if (el === 'profile') {
                                return <Breadcrumb.Item key='profile'><Link to='/profile'>个人信息</Link></Breadcrumb.Item>;
                            }
                            if (el === 'user') {
                                return <Breadcrumb.Item key='user'>用户管理</Breadcrumb.Item>;
                            }
                            if (el === 'user-list') {
                                return <Breadcrumb.Item key='user'><Link to='/user/user-list'>业务员列表</Link></Breadcrumb.Item>;
                            }
                            if (el === 'add') {
                                return <Breadcrumb.Item key='user'><Link to='/user/add'>添加业务员</Link></Breadcrumb.Item>;
                            }
                            if (el === 'customer-list') {
                                return <Breadcrumb.Item key='user'><Link to='/user/customer-list'>客户列表</Link></Breadcrumb.Item>;
                            }
                            if (el === 'customer') {
                                return <Breadcrumb.Item key='user'><Link to='/user/customer-list'>客户详情</Link></Breadcrumb.Item>;
                            }
                            if (el === 'survey') {
                                return <Breadcrumb.Item key='user'><Link to='/user/customer-list'>问卷调查结果</Link></Breadcrumb.Item>;
                            }
                            if (el === 'line-chart') {
                                return <Breadcrumb.Item key='chart'><Link to='/user/line-chart'>用户数统计</Link></Breadcrumb.Item>;
                            }
                            if (el === 'column-chart') {
                                return <Breadcrumb.Item key='chart'><Link to='/user/line-chart'>完成问卷统计</Link></Breadcrumb.Item>;
                            }

                            // // 放最后, 默认orderID都是数字
                            // if (/^[0-9]*$/.test(el) && el !== '') {
                            //     const filteredOrderUsers = orderUsers.filter(ou => ou.id == el);
                            //     if (filteredOrderUsers[0]) {
                            //         return <Breadcrumb.Item key={el}><Link to={`/order/${el}`}>{filteredOrderUsers[0].Email}</Link></Breadcrumb.Item>;
                            //     }
                            //     if (length - 1 === i) {
                            //         return <Breadcrumb.Item key={el}>{el}</Breadcrumb.Item>;
                            //     } else {
                            //         return <Breadcrumb.Item key={el}><Link to={`/order/${el}`}>{el}</Link></Breadcrumb.Item>;
                            //     }
                            // }
                        })}
                    </Breadcrumb>
                    <div style={{display: 'inline-block', float: 'right', marginRight: 25}}>
                        <Link to='/login'>
                            <Button>退出</Button>
                        </Link>
                    </div>
            </div>
        </Header>
        <Layout style={{minHeight: document.body.clientHeight - 64}}>
            <Sider
                collapsible
                collapsed={props.collapsedSider}
                onCollapse={props.onCollapseSider}
            >
                <div>
                    {props.collapsedSider ? null : <div>
                        <div style={{marginLeft: '32px', marginBottom: '12px', marginTop: 15}}>
                            <Row>
                                <Col span={6}>
                                    <Link to='/profile'><Avatar src={baseURL(headportrait)} size='large'/></Link>
                                </Col>
                                <Col span={10} offset={3}>
                                    <p style={{color: '#919191'}}>Welcome,</p>
                                    <p style={{color: '#fff'}}>{username}</p>
                                </Col>
                            </Row>
                        </div>
                    </div>}
                    <Menu
                        theme='dark'
                        mode='inline'
                        id={styles['style-1']}
                        style={{ height: document.body.clientHeight - 115, overflow: 'auto'}}
                        onSelect={e => {
                            props.history.push(e.key);
                        }}
                        selectedKeys={[props.match.path]}
                    >
                        <Menu.ItemGroup style={{ marginTop: 22 }}>
                            <SubMenu key='/user' title={<span><Icon type='user' /><span>用户管理</span></span>}>
                                <MenuItem key='/user/customer-list'>客户列表</MenuItem>
                                {/*
                                    <MenuItem key='/user/user-list'>业务员列表</MenuItem>
                                    <MenuItem key='/user/add'>添加业务员</MenuItem>
                                */}
                            </SubMenu>
                            <SubMenu key='/statistics' title={<span><Icon type='area-chart' /><span>调查统计</span></span>}>
                                <MenuItem key='/statistics/line-chart'>用户数统计</MenuItem>
                                <MenuItem key='/statistics/column-chart'>完成问卷统计</MenuItem>
                            </SubMenu>
                            <SubMenu key='/setting' title={<span><Icon type="setting" /><span>系统设置</span></span>}>
                                <MenuItem key='/login'>退出系统</MenuItem>
                                <MenuItem key='/login'>退出系统</MenuItem>
                            </SubMenu>
                        </Menu.ItemGroup>
                    </Menu>
                </div>
            </Sider>
            <Layout>
            <Content style={{ padding: '80px 20px 0 20px', overflow: 'initial', backgroundColor: '#fff' }}>
                { props.children }
            </Content>
            <Footer style={{ textAlign: 'center', backgroundColor: '#fff' }}>
                ABC©2018 Created by
            </Footer>
            </Layout>
    </Layout>
</Layout>;
};

export default Navbar;
