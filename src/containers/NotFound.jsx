import React from 'react';
import styles from './NotFound.css';
import { Button } from 'antd';

class NotFound extends React.Component {
    render() {
        return <div className={styles.notFound}>
            <h2>404</h2>
            <h1>NOT FOUND</h1>
            <Button onClick={() => {
                this.props.history.push('/');
            }}>返回首页</Button>
        </div>;
    }
}

export default NotFound;
