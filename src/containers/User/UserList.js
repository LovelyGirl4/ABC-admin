import React from 'react';
import { connect } from 'react-redux';
import { baseURL } from '../../common';
import { Table, Modal, Input, Form, Switch, Button, Avatar, Row, Col, Icon } from 'antd';
import { fetchUserList, uploadAvator, updateUser, changePassword } from '../../actions/userAction';
import { onChange, complete } from '../../actions/formAction';
import EditingUser from '../../components/User/EditingUser';
import { getUploadConfig } from '../../api';

const FormItem = Form.Item;

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: -1,
            visible: false,
            visible1: false,
            password: '',
            awsInfo: null
        };
        // 生成自定义筛选的state
        this.customFilterItems = ['name', 'email'];
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
    _generateNewData = (innerData, filterRegs) => {
        if (innerData) {
            this.customFilterItems.forEach(item => {
                innerData = innerData.map(record => {
                    if (record) {
                        if (item === 'number') {
                            const numbers = record.product.numbers;
                            let isMatch = false;
                            numbers.forEach(n => {
                                const match = n.number.toString().match(filterRegs[item + 'Reg']);
                                if (match) {
                                    isMatch = true;
                                }
                            });
                            if (isMatch) {
                                return record;
                            } else {
                                return null;
                            }
                        }

                        const match = record[item].toString().match(filterRegs[item + 'Reg']);
                        if (!match) {
                            return null;
                        }
                        return record;
                    }
                    return null;
                });
            });
            innerData = innerData.filter(record => !!record);
        }
        return innerData;
    };
    onFilterSearch = (type) => {
        // 过滤表格
        const filterRegs = this._customeFilterReg();
        let newData = this.state.originData;
        newData = this._generateNewData(newData, filterRegs);

        let filtered;
        this.customFilterItems.forEach(item => {
            if (type === item) {
                filtered = this.state[item + 'SearchText'];
            }
        });
        this.setState({
            pagination: {
                current: 1,
                pageSize: 10
            },
            [type + 'FilterDropdownVisible']: false,
            [type + 'Filtered']: !!filtered,
            data: newData
        });
    }
    onFilterReset = (type) => {
        let newState = {
            [type + 'FilterDropdownVisible']: false,
            data: this.state.originData,
        };
        this.customFilterItems.forEach(item => {
            newState = {
                ...newState,
                [item + 'Filtered']: false,
                [item + 'SearchText']: ''
            };
        });
        this.setState(newState);
    }
    onFilterInputChange = (e, type) => {
        this.setState({ [type + 'SearchText']: e.target.value });
    }

    componentWillReceiveProps(nextProps) {
        const {
            dataSource,
            pagination
        } = nextProps.user.data;
        this.state = {
            ...this.state,
            data: dataSource,
            originData: dataSource,
        };
    }
    render() {
        const { editingUser } = this.props.form;
        const {
            dataSource,
            pagination
        } = this.props.user.data;
        // const data = dataSource.map(item => {
        //     return {...item, key: item.id};
        // });
        const { fetching } = this.props.user.ui;
        const data = this.state.data && this.state.data.map((item, index) => {
            return {...item, key: index, sn: index};
        }).sort((a, b) => a.name.localeCompare(b.name));
        const { onFilterInputChange, onFilterSearch, onFilterReset } = this;
        const columns = [{
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
        }, {
            title: '头像',
            key: 'avator',
            dataIndex: 'avator',
            render: text => {
                const avator = text ? <img src={baseURL(text)} style={{ width: 30, height: 30, borderRadius: '3px' }}/> : <Avatar shape="square" icon="user" />;
                return avator;
            }
        }, {
            title: '姓名',
            key: 'name',
            dataIndex: 'name',
        }, {
            title: '邮箱',
            key: 'email',
            dataIndex: 'email',
        }, {
            title: '电话',
            key: 'mobile',
            dataIndex: 'mobile',
        }, {
            title: '角色',
            key: 'role',
            dataIndex: 'role',
            filterMultiple: false,
            filters: [{
                text: 'webmaster',
                value: 'webmaster',
            }, {
                text: 'super_admin',
                value: 'super_admin',
            }],
            onFilter: (value, record) => record.role.indexOf(value) === 0,
        }, {
            title: '备注',
            key: 'note',
            dataIndex: 'note',
            render: text => <div style={{ maxWidth: 200, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</div>
        }, {
            title: '状态',
            key: 'is_active',
            dataIndex: 'is_active',
            render: (text, record, index) => <Switch
                checkedChildren={'已激活'}
                unCheckedChildren={'未激活'}
                checked={text}
                onChange={checked => {
                    this.props.updateUser({ ...record, is_active: checked }, index);
                }}
            />
        }, {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record, index) => <span>
                <a onClick={e => {
                    e.preventDefault();
                    this.setState({ visible: true, index });
                    this.props.complete(record);
                }}>编辑</a>
                <a style={{ marginLeft: 14 }} onClick={e => {
                    e.preventDefault();
                    this.setState({ visible1: true });
                    this.props.complete(record);
                }}>重置密码</a>
            </span>,
        }];
        const rerenderColumnNames = ['name', 'email'];
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
        const title = () => {
            return <Button type='primary' size='large' onClick={() => {
                this.props.history.push('/user/add');
            }}>添加业务员</Button>;
        };
        return <div>
            <Table
                columns={columns}
                dataSource={data}
                loading={fetching}
                title={title}
            />
            <Modal
                title='编辑用户'
                visible={this.state.visible}
                onOk={() => {
                    this.props.updateUser(editingUser, this.state.index);
                    this.setState({ visible: false, index: -1 });
                }}
                onCancel={() => this.setState({ visible: false, index: -1 })}
            >
                <EditingUser
                    awsInfo={this.state.awsInfo}
                    onChange={this.props.onChange}
                    editingUser={editingUser}
                    uploadAvator={this.props.uploadAvator}
                />
            </Modal>
            <Modal
                title='重置密码'
                visible={this.state.visible1}
                onOk={() => {
                    const { password } = this.state;
                    this.props.updateUser({
                        ...editingUser,
                        password,
                    }, this.state.index);
                    this.setState({ visible1: false, index: -1, password: '' });
                    // this.props.changePassword(password);
                }}
                onCancel={() => this.setState({ visible1: false, index: -1, password: '' })}
            >
                <FormItem label='密码'>
                    <Input
                        value={this.state.password}
                        onChange={e => {
                            this.setState({ password: e.target.value });
                        }}
                    />
                </FormItem>
            </Modal>
        </div>;
    }

    componentDidMount() {
        this.props.fetchUserList({ current: 1, pageSize: 100 });
        getUploadConfig({resource: 'user', id: 'user', type: 'images'}).then(res => {
            this.setState({
                awsInfo: res
            });
        });
    }
}

export default connect(
    ({ user, form }) => ({ user, form }),
    {
        fetchUserList,
        onChange: onChange('editingUser'),
        complete: complete('editingUser'),
        uploadAvator,
        updateUser,
        changePassword
    },
)(UserList);
