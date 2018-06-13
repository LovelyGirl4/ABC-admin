import React from 'react';
import { connect } from 'react-redux';
import { baseURL } from '../../common';
import { Form, Input, Radio, Button, Switch, message, Avatar } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import { uploadAvator, createUser } from '../../actions/userAction';
import { onChange } from '../../actions/formAction';
import { s3Upload, guid } from '../../common';
import { getUploadConfig } from '../../api';
import ImageCropper from '../../components/Cropper';

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
            awsInfo: null,
            showCropper: false,
            image: null,
        };
    }
    handleOk = (e) => {
        this.setState({
            showCropper: false,
            image: null
        });
    }
    handleCancel = (e) => {
        this.setState({
            showCropper: false,
            image: null
        });
    }
    doUpload = (blobData) => {
        let awsInfo = this.state.awsInfo;
        const hide = message.loading('上传图片中', 0);
        const GUID = guid();
        console.log('doUpload');
        s3Upload(awsInfo, blobData, GUID).then(s3_URL => {
            hide();
            this.setState({
                showCropper: false,
                image: null
            });
            this.props.uploadAvator('avator', `${awsInfo.dir}/${GUID}${blobData.name}`, 'addUser');
        });
    }

    render() {
        const { addUser } = this.props.form;
        const {image, showCropper} = this.state;
        return <div>
            <ImageCropper image={image} handleOk={this.handleOk} doUpload={this.doUpload}
                handleCancel={this.handleCancel} showCropper={showCropper}
                modalWidth='40%' cropperStyle={{
                    height: 400,
                    width: '100%'
                }} ratio={4 / 4}/>
            <Form onSubmit={e => {
                e.preventDefault();
                this.props.createUser(addUser);
            }}>
                <FormItem
                    {...formItemLayout}
                    label='头像'
                >
                    {addUser.avator ? <img
                        src={baseURL(addUser.avator)}
                        style={{ width: 30, height: 30, cursor: 'pointer' }}
                        onClick={() => {
                            document.getElementById('editor-upload').click();
                        }}/> : <Avatar shape='square' icon='user' onClick={() => {
                            document.getElementById('editor-upload').click();
                        }}/>}
                    <input id='editor-upload' key={showCropper ? 1 : 2} type='file' style={{ display: 'none' }}
                        onChange={e => {
                            // 单条处理
                            e.preventDefault();
                            let files = e.target.files;
                            this.setState({
                                showCropper: true,
                                image: files[0]
                            });
                        }}
                    />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='Email'
                >
                    <Input name='email' value={addUser.email} onChange={this.props.onChange}
                        placeholder='请输入邮箱' autoComplete="off"/>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='密码'
                >
                    <Input name='password' value={addUser.password} onChange={this.props.onChange} placeholder='请输入密码'/>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='姓名'
                >
                    <Input name='name' value={addUser.name} onChange={this.props.onChange} placeholder='请输入姓名'/>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='手机'
                >
                    <Input name='mobile' value={addUser.mobile} onChange={this.props.onChange} placeholder='请输入手机号'/>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='角色'
                >
                    <RadioGroup onChange={this.props.onChange} value={addUser.role}>
                        <Radio name='role' value='webmaster'>业务员</Radio>
                        <Radio name='role' value='super_admin'>销售总监</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='备注'
                >
                    <Input name='note' type='textarea' value={addUser.note} onChange={this.props.onChange} placeholder='备注可选'/>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='激活'
                >
                    <Switch
                        checkedChildren={'已激活'}
                        unCheckedChildren={'未激活'}
                        checked={addUser.is_active}
                        onChange={checked => {
                            this.props.onChange({ target: { name: 'is_active', value: checked } });
                        }}
                    />
                </FormItem>
                <FormItem
                    wrapperCol={{ span: 12, offset: 6 }}
                >
                    <Button type='primary' htmlType='submit'>提交</Button>
                </FormItem>
            </Form>
        </div>;
    }
    componentDidMount() {
        getUploadConfig({resource: 'addUser', id: 'newUser', type: 'images'}).then(res => {
            this.setState({
                awsInfo: res
            });
        });
    }
}

export default connect(
    ({ form }) => ({ form }),
    { onChange: onChange('addUser'), uploadAvator, createUser },
)(AddUser);
