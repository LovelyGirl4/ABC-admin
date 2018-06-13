import React, {Component} from 'react';
import { Form, Input, message, Avatar } from 'antd';
const FormItem = Form.Item;
import { s3Upload, guid, baseURL } from '../../common';
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

class EditingUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        let awsInfo = this.props.awsInfo;
        const hide = message.loading('上传图片中', 0);
        const GUID = guid();
        console.log('doUpload');
        s3Upload(awsInfo, blobData, GUID).then(s3_URL => {
            hide();
            this.setState({
                showCropper: false,
                image: null
            });
            this.props.uploadAvator('avator', `${awsInfo.dir}/${GUID}${blobData.name}`, 'editingUser');
        });
    }
    render() {
        const props = this.props;
        const {image, showCropper} = this.state;
        return <div>
            <ImageCropper image={image} handleOk={this.handleOk} doUpload={this.doUpload}
                handleCancel={this.handleCancel} showCropper={showCropper}
                modalWidth='45%' cropperStyle={{
                    height: 400,
                    width: '100%'
                }} ratio={4 / 4}/>
            <Form>
                <FormItem
                    {...formItemLayout}
                    label='头像'
                >
                    {props.editingUser.avator ? <img
                        src={baseURL(props.editingUser.avator)}
                        style={{ width: 30, height: 30, cursor: 'pointer', borderRadius: '3px' }}
                        onClick={() => {
                            document.getElementById('editor-upload').click();
                        }}
                    /> : <Avatar shape="square" icon="user" onClick={() => {
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
                    {/* {showCropper ? <input id='editor-upload' key={1} type='file' style={{ display: 'none' }}
                        onChange={e => {
                            // 单条处理
                            e.preventDefault();
                            let files = e.target.files;
                            this.setState({
                                showCropper: true,
                                image: files[0]
                            });
                        }}
                    /> : <input id='editor-upload' key={2} type='file' style={{ display: 'none' }}
                        onChange={e => {
                            // 单条处理
                            e.preventDefault();
                            let files = e.target.files;
                            this.setState({
                                showCropper: true,
                                image: files[0]
                            });
                        }}
                    />} */}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='姓名'
                >
                    <Input name='name' value={props.editingUser.name} onChange={props.onChange}/>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='Email'
                >
                    <Input name='email' value={props.editingUser.email} onChange={props.onChange}/>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='手机'
                >
                    <Input name='mobile' value={props.editingUser.mobile} onChange={props.onChange}/>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='备注'
                >
                    <Input name='note' value={props.editingUser.note} onChange={props.onChange}/>
                </FormItem>
            </Form>
        </div>;
    }
}

export default EditingUser;
