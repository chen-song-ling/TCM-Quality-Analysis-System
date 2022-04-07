import React from 'react';
import { useState, useEffect } from "react";
import './PictureWall.css';
import { Upload, Button, Modal, notification, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export default function PictureWall(props) {

    const [fileList, setFileList] = useState(
        [
            // {
            //   uid: '0',
            //   name: 'xxx.png',
            //   status: 'done',
            // //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // //   thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // },
            // {
            //   uid: '1',
            //   name: 'yyy.png',
            //   status: 'error',
            // },
        ]
    );
    const [cropper, setCropper] = useState();
    const [cropModalData, setCropModalData] = useState({
        isCroplModalVisible: false,
        options: null,
        img: null,
    })

    
    const onRemove = (file) => {
        console.log(file);
        setFileList([...fileList].filter((item) => {
            return item.uid !== file.uid;
        }));
    };

    const onChange = (info) => {
        // console.log(info);
    };

    const onPreview = (file) => {

    }

    const customRequest = (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        // console.log(options);
        let newFile = {
            uid: file.uid,
            name: file.name,
            status: 'uploading',
        }
        setFileList([...fileList, newFile]);

        const reader = new FileReader();
        reader.onload = () => {
            // console.log(reader.result);
            setCropModalData({
                isCroplModalVisible: true,
                options: options,
                img: reader.result,
            })
        };
        reader.readAsDataURL(file);

    };

    const onCropModalOk = () => {
        if (typeof cropper !== "undefined") {
            let canvas = cropper.getCroppedCanvas();
            let imgUrl = cropper.getCroppedCanvas().toDataURL();
            
            let newFileList = [...fileList];
            for (let i = 0; i < newFileList.length; i++) {
                if (newFileList[i].uid === cropModalData.options.file.uid) {
                    newFileList[i] = {
                        ...newFileList[i],
                        thumbUrl: imgUrl,
                        // url: imgUrl,
                        status: 'done',
                    };
                    break;
                }
            }
            setFileList(newFileList);
            props.uploadFileList(newFileList);

            setCropModalData({
                isCroplModalVisible: false,
                options: null,
                img: null,
            });
        }
    };

    const onCropModalCancel = () => {
        setFileList([...fileList].filter((item) => {
            return item.uid !== cropModalData.options.file.uid;
        }));

        setCropModalData({
            isCroplModalVisible: false,
            options: null,
            img: null,
        });
    };

    return (
        <div className="mp-c-picwall">
            <Upload
                // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                accept="image/*"
                listType="picture"
                fileList={fileList}
                className="upload-list-inline"
                onRemove={onRemove}
                onChange={onChange}
                customRequest={customRequest}
                onPreview={onPreview}
            >
                <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>

            <Modal className="mp-c-picwall-modal" title="裁剪图片" visible={cropModalData.isCroplModalVisible} onOk={onCropModalOk} onCancel={onCropModalCancel}>
                <Cropper
                    style={{ height: 400, width: "100%" }}
                    zoomable={false}
                    modal={false}
                    highlight={false}
                    zoomTo={0.5} //
                    initialAspectRatio={0}
                    preview=".img-preview"
                    src={cropModalData.img}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                    onInitialized={(instance) => {
                        setCropper(instance);
                    }}
                    guides={true}
                />
            </Modal>

        </div>
    );
}
