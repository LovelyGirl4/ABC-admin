import React from 'react';
import { Icon } from 'antd';
import { baseURL } from '../common';

export default class Slick extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
        };
    }

    render() {
        const images = this.props.images || [];
        if (images.length < 1) {
            return <div></div>;
        }
        const length = images.length;
        return <div>
            <div
                style={{
                    width: 300,
                    height: 300,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <div style={{ position: 'absolute', margin: 'auto', left: 0, top: 0, bottom: 0, width: 32, height: 32, background: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                    onClick={() => this.setState({ index: (this.state.index - 1) < 0 ? (length - 1) : (this.state.index - 1) })}
                >
                    <Icon type='caret-left' style={{ fontSize: 32 }}/>
                </div>
                <img
                    src={baseURL(images[this.state.index % length].url)}
                    style={{
                        userSelect: 'none',
                        width: 300,
                        height: 300,
                        transform: `translateX${300 * (this.state.index % length)}`,
                    }}
                />
                <div style={{ position: 'absolute', margin: 'auto', right: 0, top: 0, bottom: 0, width: 32, height: 32, background: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                    onClick={() => this.setState({ index: (this.state.index + 1) >= length ? 0 : (this.state.index + 1) })}
                >
                    <Icon type='caret-right' style={{ fontSize: 32 }}/>
                </div>
            </div>
            <div style={{ marginTop: 15, overflowY: 'hidden', overflowX: 'scroll' }}>
                {
                    images.map((image, index) => <img
                        key={index}
                        src={baseURL(image.url)}
                        style={{
                            width: 75,
                            height: 75,
                            border: this.state.index === index ? '3px solid rgb(59,138,229)' : 'none',
                            cursor: 'pointer',
                        }}
                        onClick={() => this.setState({ index })}
                    />)
                }
            </div>
        </div>;
    }
}
