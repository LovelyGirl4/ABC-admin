import React from 'react';
import { connect } from 'react-redux';
import { baseURL } from '../../common';
import { Form, Input, Radio, Button, Switch, Select, Modal, Avatar } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;

import { fetchUserList } from '../../actions/userAction';
import { fetchCustomer, updateCustomer, fetchCustomerList } from '../../actions/customerAction';
import { onChange, updateWaiter } from '../../actions/formAction';
import noPicture from '../../components/img/no_picture.gif';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

class AddUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectValue: '',
            visible: false,
            imageURL: '',
        };
    }
    render() {
        const { customers } = this.props;
        const customer = customers[0];
        console.log('customers:', customers);
        const {id, headimgurl, nick_name, gender, province, city, mobile} = customer;
        const readOnly = false;
        const disable = false;
        console.log('customer:', customer);
        // const { updateFetching, customerFetching } = this.props.customer.ui;
        return <Form onSubmit={e => {
            e.preventDefault();
            // this.props.updateCustomer(customer);
        }}>
            <FormItem
                {...formItemLayout}
                label='id'
            >
                {id}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='头像'
            >
                {headimgurl ? <img src={baseURL(headimgurl)} style={{ width: 30, height: 30, borderRadius: '3px' }}/> : <Avatar shape="square" icon="user" />}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='角色'
            >
                customer
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='昵称'
            >
                <Input name='nick_name' value={customer.nick_name} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='姓别'
            >
                <RadioGroup onChange={this.props.onChange} value={gender} disabled={disable}>
                    <Radio name='gender' value={1} >男</Radio>
                    <Radio name='gender' value={2} >女</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='省份'
            >
                <Input name='province' value={province} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='城市'
            >
                <Input name='city' value={city} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='手机号'
            >
                <Input name='mobile' value={mobile} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
        </Form>;
    }

    componentDidMount() {
        this.props.fetchCustomerList({page: 1, page_size: 10});
        // this.props.fetchCustomer(this.props.match.params.id);
        // this.props.fetchUserList();
    }
    // componentWillReceiveProps(nextProps) {
    //     this.setState({
    //         selectValue: nextProps.form.customer.waiter_id
    //     });
    // }
}

export default connect(
    ({ customer }) => ({
        customers: customer.data.dataSource,
    }),
    { onChange: onChange('customer'), fetchCustomer, fetchCustomerList},
)(AddUser);
