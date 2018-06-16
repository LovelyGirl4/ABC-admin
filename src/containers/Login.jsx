import React from 'react';
import { connect } from 'react-redux';
import { Button, Input, Form, Icon, Card, Row, Col, message } from 'antd';
import { fetchLogin } from '../actions/login';
const FormItem = Form.Item;
const inputStyle = {
    xs: { span: 18},
    sm: { span: 16, offset: 2},
    md: { span: 12, offset: 3},
};
const verificationStyle = {
    xs: { span: 6},
    sm: { span: 4},
    md: { span: 6},
};
class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        code: ''
    }
    submit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                if (values.verification.toUpperCase() != this.state.code) {
                    message.error('验证码输入错误！');
                    this.createCode();
                } else {
                    this.props.fetchLogin(values.email, values.password);
                }
            }
        });
    }

    createCode = () => {
        let newCode = '';
        const codeLength = 4;
        const random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
            'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        for (var i = 0; i < codeLength; i++) {
            var index = Math.floor(Math.random() * 36);
            newCode += random[index];
        }
        this.red = parseInt(Math.random() * 255);
        this.green = parseInt(Math.random() * 255);
        this.blue = parseInt(Math.random() * 255);
        this.setState({
            code: newCode
        });
    }

    render() {
        const { fetching } = this.props.login.ui;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            wrapperCol: {
                xs: { span: 24},
                sm: { span: 20, offset: 2},
                md: { span: 18, offset: 3},
            },
        };
        const height = document.body.clientHeight * 0.28;
        return <div style={{paddingTop: height}}>
            <Card
                title='QTour 后台管理'
                style={{ width: 400, height: 300, margin: 'auto' }}>
                <Form onSubmit={this.submit}>
                    <FormItem
                        {...formItemLayout}
                        hasFeedback
                    >
                        {getFieldDecorator('email',
                            // {
                            //     rules: [{
                            //         type: 'email', message: '邮箱',
                            //     }, {
                            //         required: true, message: '请输入邮箱',
                            //     }],
                            // }
                        )(
                            <Input
                                placeholder='用户名'
                                prefix={<Icon type='user' />}
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        hasFeedback
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: '请输入密码',
                            }],
                        })(
                            <Input
                                placeholder='密码'
                                type='password'
                                prefix={<Icon type='lock' />}
                            />
                        )}
                    </FormItem>
                    <Row>
                        <Col xs={inputStyle.xs} sm={inputStyle.sm} md={inputStyle.md}>
                            <FormItem
                                hasFeedback
                            >
                                {getFieldDecorator('verification', {
                                    rules: [{
                                        required: true, message: '请输入验证码',
                                    }],
                                })(
                                    <Input placeholder='验证码' id='verification'/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={verificationStyle.xs} sm={verificationStyle.sm} md={verificationStyle.md}>
                            <Input type = 'button' size='large' id='code' onClick={this.createCode} value={this.state.code}
                                style={{fontStyle: 'italic', backgroundColor: `rgb(${this.red}, ${this.green}, ${this.blue})`, color: '#fff'}}/>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout}>
                      <Button
                          style={{ width: '100%' }}
                          type='primary'
                          loading={fetching}
                          htmlType="submit"
                          >登录</Button>
                    </FormItem>
                </Form>
            </Card>
        </div>;
    }

    componentDidMount() {
        document.body.style.background = 'rgb(55, 55, 55)';
        this.createCode();
    }

    componentWillUnmount() {
        document.body.style.background = '';
    }
}

const WrappedLoginForm = Form.create()(Login);
export default connect(
    ({ login }) => ({ login }),
    { fetchLogin }
)(WrappedLoginForm);
