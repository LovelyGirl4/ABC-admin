import React from 'react';
import { connect } from 'react-redux';

import { Table, Modal, Input, Form, Switch, Button, Row, Col, Icon } from 'antd';
import { fetchCustomerList, updateCustomer } from '../../actions/customerAction';

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
    onFilterSearch = (type) => {
        const {first_nameSearchText, surnameSearchText, company_nameSearchText, filteredState} = this.state;
        const pagination = { current: 1, pageSize: 10 };
        this.props.fetchCustomerList(pagination, first_nameSearchText, surnameSearchText, company_nameSearchText, filteredState);

        let filtered;
        this.customFilterItems.forEach(item => {
            if (type === item) {
                filtered = this.state[item + 'SearchText'];
            }
        });
        this.setState({
            [type + 'FilterDropdownVisible']: false,
            [type + 'Filtered']: !!filtered,
        });
    }
    onFilterReset = (type) => {
        let newState = {
            [type + 'FilterDropdownVisible']: false,
        };
        this.customFilterItems.forEach(item => {
            newState = {
                ...newState,
                [item + 'Filtered']: false,
                [item + 'SearchText']: ''
            };
        });
        this.setState(newState);
        this.props.fetchCustomerList({current: 1});
    }
    onFilterInputChange = (e, type) => {
        this.setState({ [type + 'SearchText']: e.target.value });
    }
    tableChange = (pagination, filters) => {
        this.setState({
            filteredState: filters && filters.state
        });
        if (!filters) {
            this.props.fetchCustomerList({current: 1});
        }
        const {first_nameSearchText, surnameSearchText, company_nameSearchText, filteredState} = this.state;
        this.props.fetchCustomerList(pagination, first_nameSearchText, surnameSearchText, company_nameSearchText, filters && filters.state);
    }
    render() {
        const {
            dataSource,
            current_page,
            total_count
        } = this.props.customer.data;
        const data = dataSource && dataSource.map((item, index) => {
            return {...item, key: index};
        });
        const { fetching } = this.props.customer.ui;
        const { onFilterInputChange, onFilterSearch, onFilterReset } = this;
        const columns = [{
            title: 'Customer ID',
            key: 'id',
            dataIndex: 'id',
            width: 30,
        }, {
            title: '名字',
            key: 'first_name',
            dataIndex: 'first_name',
        }, {
            title: '中间名',
            key: 'middle_name',
            dataIndex: 'middle_name',
        }, {
            title: '姓氏',
            key: 'surname',
            dataIndex: 'surname',
        }, {
            title: '性别',
            key: 'gender',
            dataIndex: 'gender',
            render: text => text === 'male' ? '男' : '女',
        }, {
            title: '职位',
            key: 'position',
            dataIndex: 'position',
        }, {
            title: '公司名称',
            key: 'company_name',
            dataIndex: 'company_name',
        }, {
            title: '国家',
            key: 'country',
            dataIndex: 'country',
        }, {
            title: '手机号',
            key: 'mobile',
            dataIndex: 'mobile',
        }, {
            title: '电话',
            key: 'telephone',
            dataIndex: 'telephone',
        }, {
            title: '状态',
            key: 'state',
            dataIndex: 'state',
            width: 90,
            filterMultiple: false,
            filters: [{
                text: '已激活',
                value: 'approved',
            }, {
                text: '未激活',
                value: ['disapproved', 'pending_approval'].join('|'),
            }],
            render: (text, record, index) => {
                return <Switch
                    checkedChildren={'已激活'}
                    unCheckedChildren={'未激活'}
                    checked={text === 'approved' ? true : false}
                    onChange={checked => {
                        this.props.updateCustomer({ ...record, state: checked === true ? 'approved' : 'disapproved'}, index);
                    }}
                />;
            }
        }, {
            title: '详细信息',
            key: 'detail',
            dataIndex: 'detail',
            render: (text, record) => <a onClick={e => {
                e.preventDefault();
                this.props.history.push(`/user/customer/${record.id}`);
            }}>详细信息</a>
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
                                        onChange={(e) => onFilterInputChange(e, name)}
                                        onPressEnter={() => onFilterSearch(name)}
                                    />
                                </Row>
                                <Row gutter={16} style={{marginTop: 8}}>
                                    <Col className="gutter-row" span={12}>
                                        <Button type="primary" onClick={() => onFilterSearch(name)}>
                                            Search
                                        </Button>
                                    </Col>
                                    <Col className="gutter-row" span={12}>
                                        <Button onClick={() => onFilterReset(name)}>Reset</Button>
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
        const tablePage = {current: current_page, total: total_count};
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
        this.props.fetchCustomerList({current: 1});
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.profile && nextProps.profile) {
            this.props.fetchCustomerList({current: 1});
        }
    }
}

export default connect(
    ({ customer, login }) => ({ customer, profile: login.data && login.data.profile }),
    { fetchCustomerList, updateCustomer },
)(CustomerList);
