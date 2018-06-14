import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Form, Input } from 'antd';

const FormItem = Form.Item;


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
    },
};

class Survey extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div style={{marginLeft: 100, marginTop: 20}}>
            <p style={{fontSize: 16, fontWeight: 'bold'}}>1、所有银行日均（日常）存款（万元）</p>
            <p style={{fontSize: 14, fontWeight: 'bold', marginLeft: 26}}>20</p>
            <p style={{fontSize: 16, fontWeight: 'bold'}}>2、已有保证（信用）贷款（万元）</p>
            <p style={{fontSize: 14, fontWeight: 'bold', marginLeft: 26}}>50</p>
        </div>;
    }
}

export default connect(
    () => ({ }),
    {},
)(Survey);
