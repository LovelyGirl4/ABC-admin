import React, {Component} from 'react';
import { connect } from 'react-redux';

class Messages extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { messages } = this.props;
        console.log('messages:', messages);
        return <div>
            messages
            {/* {messages.notification && messages.notification.content} */}
        </div>;
    }
}

export default connect(
    ({ login }) => ({messages: login.data.messages.notifications})
)(Messages);
