import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Radio, Button, Switch, message } from 'antd';
import { baseURL } from '../common';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import { fetchProfile, uploadAvator, updateProfile } from '../actions/userAction';
import { onChange } from '../actions/formAction';
import { s3Upload, guid } from '../common';
import { getUploadConfig } from '../api';
import ImageCropper from '../components/Cropper';

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

class Profile extends React.Component {
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
        s3Upload(awsInfo, blobData, GUID).then(s3_URL => {
            hide();
            this.setState({
                showCropper: false,
                image: null
            });
            this.props.uploadAvator('avator', `${awsInfo.dir}/${GUID}${blobData.name}`, 'profile');
        });
    }
    render() {
        const { profile } = this.props.form;
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
                this.props.updateProfile(profile);
            }}>
                <FormItem
                    {...formItemLayout}
                    label='头像'
                >
                    <img
                        src={baseURL(profile.avator)}
                        style={{ width: 30, height: 30, cursor: 'pointer', borderRadius: '3px' }}
                        onClick={() => {
                            document.getElementById('editor-upload').click();
                        }}
                    />
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
                    label='姓名'
                >
                    <Input name='name' value={profile.name} onChange={this.props.onChange}/>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='邮箱'
                >
                    <Input name='email' value={profile.email} onChange={this.props.onChange}/>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='手机'
                >
                    <Input name='mobile' value={profile.mobile} onChange={this.props.onChange}/>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='备注'
                >
                    <Input name='note' type='textarea' value={profile.note} onChange={this.props.onChange}/>
                </FormItem>
                <FormItem
                    wrapperCol={{ span: 12, offset: 6 }}
                >
                    <Button type='primary' htmlType='submit'>更改</Button>
                </FormItem>
            </Form>
        </div>;
    }

    componentDidMount() {
        this.props.fetchProfile();
        getUploadConfig({resource: 'profile', id: 'profile', type: 'images'}).then(res => {
            this.setState({
                awsInfo: res
            });
        });
    }
}

export default connect(
    ({ form }) => ({ form }),
    { fetchProfile, onChange: onChange('profile'), uploadAvator, updateProfile },
)(Profile);
