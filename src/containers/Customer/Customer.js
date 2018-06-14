import React from 'react';
import { connect } from 'react-redux';
import { baseURL } from '../../common';
import { Form, Input, Radio, Button, Switch, Select, Modal } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;

import { fetchUserList } from '../../actions/userAction';
import { fetchCustomer, updateCustomer } from '../../actions/customerAction';
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
        const { customer } = this.props.form;
        const { updateFetching, customerFetching } = this.props.customer.ui;
        const { role } = this.props;
        const waiters = this.props.user.data.dataSource && this.props.user.data.dataSource.filter(u => {
            return u.role === 'webmaster' && u.is_active === true;
        });
        const waiterOption = waiters && waiters.map(w => {
            return <Option value={(w.user_id).toString()} key={w.user_id}>{w.name}</Option>;
        });
        const readOnly = role === 'webmaster' ? true : false;
        const disable = role === 'webmaster' ? true : false;
        let registrationCertificate;
        if (customer.registration_certificate) {
            try {
                const registration_certificate = JSON.parse(customer.registration_certificate);
                registrationCertificate = registration_certificate.map((rc, index) => {
                    return <img name='registration_certificate' src={baseURL(rc ? rc : noPicture)}
                        key={index} style={{width: '150px', height: '150px', cursor: 'pointer', marginRight: 6}}
                        onClick={() => {
                            this.setState({
                                visible: true,
                                imageURL: rc,
                            });
                        }}/>;
                });
            } catch (e) {
                console.log(e);
            }
        }
        return <Form style={{ display: customerFetching ? 'none' : '' }} onSubmit={e => {
            e.preventDefault();
            this.props.updateCustomer(customer);
        }}>
            <FormItem
                {...formItemLayout}
                label='id'
            >
                {customer.id}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='Email'
            >
                <Input name='email' value={customer.email} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='角色'
            >
                {customer.role}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='state'
            >
                <RadioGroup onChange={this.props.onChange} value={customer.state === 'approved' ? 'approved' : 'disapproved'} disabled={disable}>
                    <Radio name='state' value='approved'>已激活</Radio>
                    <Radio name='state' value='disapproved'>未激活</Radio>
                </RadioGroup>
            </FormItem>
            {/*
                <FormItem
                {...formItemLayout}
                label='业务员'
            >
                <Select showSearch value={this.state.selectValue === null ? '未分配业务员' : this.state.selectValue}
                    placeholder='未分配业务员' onChange={(value) => {
                        this.props.updateWaiter('customer', 'waiter_id', value);
                        this.setState({
                            selectValue: value
                        });
                    }
                    } disabled={disable} filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    {waiterOption}
                </Select>
            </FormItem>
            */}
            <FormItem
                {...formItemLayout}
                label='名字'
            >
                <Input name='first_name' value={customer.first_name} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='中间名'
            >
                <Input name='middle_name' value={customer.middle_name} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='姓氏'
            >
                <Input name='surname' value={customer.surname} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='姓别'
            >
                <RadioGroup onChange={this.props.onChange} value={customer.gender} disabled={disable}>
                    <Radio name='gender' value='male' >男</Radio>
                    <Radio name='gender' value='female' >女</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='职位'
            >
                <Input name='position' value={customer.position} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='公司名称'
            >
                <Input name='company_name' value={customer.company_name} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='国家'
            >
                <Input name='country' value={customer.country} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='公司地址'
            >
                <TextArea rows={3} style={{resize: 'none'}} name='company_address' value={customer.company_address} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='手机'
            >
                <Input name='mobile' value={customer.mobile} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='电话'
            >
                <Input name='telephone' value={customer.telephone} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='传真'
            >
                <Input name='fax' value={customer.fax} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='即时信息'
            >
                <Input name='instant_message' value={customer.instant_message} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='登记证书'
            >
                {registrationCertificate}
                <Modal visible={this.state.visible} footer={null} onCancel={() => {
                    this.setState({
                        visible: false,
                    });
                }}>
                    <a href={this.state.imageURL}>
                        <img name='registration_certificate' src={baseURL(this.state.imageURL)}
                            style={{width: '420px', height: '420px', margin: '30px'}}/>
                    </a>
                </Modal>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='默认报价方式'
            >
                <RadioGroup onChange={this.props.onChange} value={customer.quote_type} disabled={disable}>
                    <Radio name='quote_type' value={0}>销售利润率</Radio>
                    <Radio name='quote_type' value={1}>成本利润率</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label='备注'
            >
                <TextArea rows={4} style={{resize: 'none'}} name='note' value={customer.note} onChange={this.props.onChange} readOnly={readOnly}/>
            </FormItem>
            <FormItem
                wrapperCol={{ span: 12, offset: 6 }}
            >
                <Button loading={updateFetching} type='primary' htmlType='submit' disabled={disable}>提交</Button>
            </FormItem>
        </Form>;
    }

    componentDidMount() {
        this.props.fetchCustomer(this.props.match.params.id);
        this.props.fetchUserList();
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            selectValue: nextProps.form.customer.waiter_id
        });
    }
}

export default connect(
    ({ form, customer, user, login }) => ({ form, customer, user, role: login.data.profile.role}),
    { onChange: onChange('customer'), fetchCustomer, updateCustomer, fetchUserList, updateWaiter},
)(AddUser);
