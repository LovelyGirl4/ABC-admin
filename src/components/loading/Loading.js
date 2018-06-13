// 询价管理的加载loading
import React, {Component} from 'react';
import styles from './Loading.css';

const height = document.body.clientHeight * 0.3;
const Loading = () => {
    return <div>
        <div className={styles.spinner} style={{marginTop: height}}>
            <div className={styles.rect1}></div>
            <div className={styles.rect2}></div>
            <div className={styles.rect3}></div>
            <div className={styles.rect4}></div>
            <div className={styles.rect5}></div>
        </div>
    </div>;
};

export default Loading;
