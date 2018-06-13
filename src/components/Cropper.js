// 上传图片时，截图
import React, {Component} from 'react';
import Cropper from 'react-cropper';
import { Modal, Button } from 'antd';
import 'cropperjs/dist/cropper.css';
import {getBase64Image, dataURLtoBlob} from '../common';

class ImageCropper extends Component {
    _crop = () => {
        // image in dataUrl
        // console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
    }
    state = {
        url: ''
    }
    componentWillReceiveProps(nextProps) {
        const {image} = nextProps;
        image && getBase64Image(image).then(data => this.setState({
            url: data
        }));
    }
    cropImage = () => {
        if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
            return;
        }
        const imageBlob = dataURLtoBlob(this.cropper.getCroppedCanvas().toDataURL());
        imageBlob.name = this.props.image.name;
        this.props.doUpload(imageBlob);
    }
    render() {
        const {handleOk, handleCancel, showCropper, modalWidth, cropperStyle, ratio} = this.props;
        return <div>
            <Modal
                width={modalWidth ? modalWidth : '50%'}
                style={{ top: 20 }}
                title="Cropper"
                visible={showCropper}
                onOk={this.cropImage}
                onCancel={handleCancel}
            >
                <Cropper ref={cropper => {
                    this.cropper = cropper;
                }} src={this.state.url} style={cropperStyle ? cropperStyle : {
                    height: 400,
                    width: '100%'
                }}
                aspectRatio={ratio ? ratio : 4 / 4} guides={false} crop={this._crop}/>
            </Modal>
          </div>;
    }
}
export default ImageCropper;
