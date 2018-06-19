import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Form, Input } from 'antd';
import { fetchSurveyResult } from '../../actions/customerAction';

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

    componentDidMount() {
        this.props.fetchSurveyResult(this.props.match.params.id);
    }

    render() {
        const {data} = this.props;
        return <div style={{margin: 'auto', marginTop: 20, textAlign: 'left', width: 400}}>
            {
                data.length > 0 ? <div>
                    {data.map((d, index) => {
                        return <div key={index} style={{marginTop: 10}}>
                            <h2>{d.name}</h2>
                            {d.questions.map((q, i) => {
                                return <div style={{marginTop: 10}} key={i}>
                                <p style={{fontSize: 15, fontWeight: 'bold'}}>{i + 1}、{q.question}</p>
                                <p style={{fontSize: 16, fontWeight: 'bold', marginLeft: 26}}>{q.answer}</p>
                            </div>;
                            })}
                        </div>;
                    })}
                </div> : <div style={{marginTop: 50, fontSize: 16, textAlign: 'center'}}>暂无问卷</div>
            }
        </div>;
    }
}

export default connect(
    ({customer}) => ({
        data: customer.data.exam
    }),
    {fetchSurveyResult},
)(Survey);
