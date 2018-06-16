import React from 'react';
import { connect } from 'react-redux';

import { Table, Modal, Input, Form, Switch, Button, Row, Col, Icon, Avatar } from 'antd';
import { fetchCustomerList, updateCustomer } from '../../actions/customerAction';
import { baseURL } from '../../common';

class CustomerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredState: ''
        };
        // 生成自定义筛选的state
        this.customFilterItems = ['first_name', 'surname', 'company_name'];
        this.customFilterItems.forEach(item => {
            this.state = {
                ...this.state,
                [item + 'FilterDropdownVisible']: false,
                [item + 'SearchText']: '',
                [item + 'Filtered']: false,
            };
        });
    }

    // 生成自定义过滤的正则
    _customeFilterReg = () => {
        let wordsArr = this.customFilterItems.map(item => this.state[item + 'SearchText']);
        wordsArr = wordsArr.map((word) => {
            return word.replace(/\s*/g, '').split('');
        });
        let texts = wordsArr.map((word) => {
            let w = word.join('[\\S\\s]*');
            return '[\\S\\s]*' + w + '[\\S\\s]*';
        });
        let regs = texts.map((text) => {
            return new RegExp(text, 'gi');
        });
        let regObj = {};
        this.customFilterItems.forEach((item, index) => {
            regObj[item + 'Reg'] = regs[index];
        });
        return regObj;
    }
    // onFilterSearch = (type) => {
    //     const {first_nameSearchText, surnameSearchText, company_nameSearchText, filteredState} = this.state;
    //     const pagination = { page: 1, page_size: 10 };
    //     this.props.fetchCustomerList(pagination, first_nameSearchText, surnameSearchText, company_nameSearchText, filteredState);

    //     let filtered;
    //     this.customFilterItems.forEach(item => {
    //         if (type === item) {
    //             filtered = this.state[item + 'SearchText'];
    //         }
    //     });
    //     this.setState({
    //         [type + 'FilterDropdownVisible']: false,
    //         [type + 'Filtered']: !!filtered,
    //     });
    // }
    // onFilterReset = (type) => {
    //     let newState = {
    //         [type + 'FilterDropdownVisible']: false,
    //     };
    //     this.customFilterItems.forEach(item => {
    //         newState = {
    //             ...newState,
    //             [item + 'Filtered']: false,
    //             [item + 'SearchText']: ''
    //         };
    //     });
    //     this.setState(newState);
    //     this.props.fetchCustomerList({ page: 1, page_size: 10 });
    // }
    // onFilterInputChange = (e, type) => {
    //     this.setState({ [type + 'SearchText']: e.target.value });
    // }
    tableChange = (pagination, filters) => {
        // this.setState({
        //     filteredState: filters && filters.state
        // });
        this.props.fetchCustomerList({ page: pagination.current, page_size: 10 });
        // if (!filters) {
        //     this.props.fetchCustomerList({ page: 1, page_size: 10 });
        // }
        // const {first_nameSearchText, surnameSearchText, company_nameSearchText, filteredState} = this.state;
        // this.props.fetchCustomerList(pagination, first_nameSearchText, surnameSearchText, company_nameSearchText, filters && filters.state);
    }
    render() {
        const {fetching, customers, page} = this.props;
        const data = customers && customers.map((item, index) => {
            return {...item, key: index + 1};
        });
        // const { fetching } = this.props.customer.ui;
        // const { onFilterInputChange, onFilterSearch, onFilterReset } = this;
        const columns = [{
            title: '序号',
            key: 'key',
            dataIndex: 'key',
            width: 30,
        }, {
            title: '头像',
            key: 'headimgurl',
            dataIndex: 'headimgurl',
            render: text => {
                const avator = text ? <img src={baseURL(text)} style={{ width: 30, height: 30, borderRadius: '3px' }}/> : <Avatar shape="square" icon="user" />;
                return avator;
            }
        }, {
            title: '昵称',
            key: 'nick_name',
            dataIndex: 'nick_name',
        }, {
            title: '性别',
            key: 'gender',
            dataIndex: 'gender',
            render: text => text === 1 ? '男' : '女',
        }, {
            title: '省份',
            key: 'province',
            dataIndex: 'province',
        }, {
            title: '城市',
            key: 'city',
            dataIndex: 'city',
        }, {
            title: '手机号',
            key: 'mobile',
            dataIndex: 'mobile',
        }, {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record) => <span>
            <a onClick={e => {
                e.preventDefault();
                this.props.history.push(`/user/customer/${record.id}`);
            }}>详细信息</a>
            <a style={{ marginLeft: 14 }} onClick={e => {
                e.preventDefault();
                this.props.history.push(`/user/survey/${record.id}`);
            }}>问卷结果</a>
        </span>
        }];
        const rerenderColumnNames = ['first_name', 'surname', 'company_name'];
        rerenderColumnNames.forEach((name) => {
            columns.forEach((column, index) => {
                if (column.key === name) {
                    columns[index] = {...columns[index], filterDropdown: (
                            <div style={{padding: 8, borderRadius: 6, background: '#fff', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}}>
                                <Row>
                                    <Input
                                        ref={(ele) => {
                                            this[name + 'SearchInput'] = ele;
                                        }}
                                        placeholder={'Search ' + name}
                                        value={this.state[name + 'SearchText']}
                                        // onChange={(e) => onFilterInputChange(e, name)}
                                        // onPressEnter={() => onFilterSearch(name)}
                                    />
                                </Row>
                                <Row gutter={16} style={{marginTop: 8}}>
                                    <Col className="gutter-row" span={12}>
                                        <Button type="primary">
                                            Search
                                        </Button>
                                    </Col>
                                    <Col className="gutter-row" span={12}>
                                        <Button>Reset</Button>
                                    </Col>
                                </Row>
                            </div>
                        ),
                        filterIcon: <Icon type="search" style={{ color: this.state[name + 'Filtered'] ? '#108ee9' : '#aaa' }} />,
                        filterDropdownVisible: this.state[name + 'FilterDropdownVisible'],
                        onFilterDropdownVisibleChange: visible => {
                            this.setState({ [name + 'FilterDropdownVisible']: visible }, () => this[name + 'SearchInput'].focus());
                        },
                    };
                }
            });
        });
        const tablePage = {current: page.current_page, total: page.total_count};
        return <div>
            <Table
                columns={columns}
                dataSource={data}
                loading={fetching}
                pagination={tablePage}
                onChange={this.tableChange}
            />
        </div>;
    }

    componentDidMount() {
        this.props.fetchCustomerList({page: 1, page_size: 10});
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.profile && nextProps.profile) {
            this.props.fetchCustomerList({page: 1, page_size: 10});
        }
    }
}

export default connect(
    ({ customer }) => ({
        customers: customer.data.dataSource,
        page: customer.data.page,
        ui: customer.ui.fetching
    }),
    { fetchCustomerList, updateCustomer },
)(CustomerList);
