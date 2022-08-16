import React from 'react';
import { Layout, Menu, Button, Modal, Space, notification, Upload } from 'antd';
import { chromConfig } from '../util/const';
import { useState, useEffect, useRef } from "react";
import './ColorPicker.css';

export default function ColorPicker(props) {

    const [pointCorlor, setPointCorlor] = useState(null);


    useEffect(() => {
        if (props.isColorPickerModalVisible === true) {
            setPointCorlor(null);
            reDrawImg();
        }
    }, [props.isColorPickerModalVisible]);

    const reDrawImg = () => {
        let cid = "the-chmt-markblk-canvas-colorpicker";
        let cv = document.getElementById(cid)?.getContext('2d');
        if (cv === undefined || props.focusedCv < 0 || props.focusedCv >= props.cropImgList.length) {
            return;
        }

        let id = props.focusedCv;
        let ow = props.cropBoxSizeList[id].width;
        let oh = props.cropBoxSizeList[id].height;
        let scalingRatio = Math.min(config.num_canvas_height / oh, (config.num_canvas_width - config.num_canvas_padding_left) / ow);

        let w = ow * scalingRatio;
        let h = oh * scalingRatio;
        let x = config.num_canvas_width - w;
        let y = config.num_canvas_height - h;

        let img = new Image();
        img.src = props.cropImgList[id];

        img.onload = () => {
            cv.clearRect(0, 0, config.num_canvas_width, config.num_canvas_height);
            cv.drawImage(img, x, y, w, h);
        };
    }

    const onOk = () => {
        props.ptc_uploadIsColorPickerModalVisible(false);
    }

    const onCancel = () => {
        props.ptc_uploadIsColorPickerModalVisible(false);
    }

    // const setColorStr = (color) => {
    //     if (color === null) {
    //         return "null";
    //     } else {
    //         return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    //     }
    // }
    const setColorStr = (color) => {
        if (color === null) {
            return "null";
        } else {
            let max=Math.max(color[0],color[1],color[2]);
            let min=Math.min(color[0],color[1],color[2]);
            let H,S,V=(color[0],color[1],color[2]);
            if(max!==min){
                if (max === color[0])
                    H=(color[1]-color[2])/(max-min);
                if (max === color[1])
                    H=2+(color[2]-color[0])/(max-min);
                if (max === color[2])
                    H=4+(color[0]-color[1])/(max-min);
            }
            else{
                H=0;
            }
            H=60*H;
            if(H<0)
                H=H+360;
            V=max/255;
            if(max!==0)
                S=(max-min)/max;
            else
                S=0;
            return `rgb(${color[0]}, ${color[1]}, ${color[2]})\nhsv(${Math.round(H)}, ${(S*100).toFixed(1)}%, ${(V*100).toFixed(1)}%)`;
        }
    }

    const setColorRectStyle = (color) => {
        if (color === null) {
            return { "backgroundColor": "#FFFFFF" };
        } else {
            return { "backgroundColor": `rgb(${color[0]}, ${color[1]}, ${color[2]})` };
        }
    }

    const config = {
        num_canvas_width: chromConfig.standardMarkCanvasWidth,
        num_canvas_height: chromConfig.standardMarkCanvasHeight,
        num_canvas_padding_left: chromConfig.standardMarkCanvasPaddingLeft,
        num_canvas_number_size: chromConfig.standardMarkCanvasFontsize,
    }

    const handleCanvasClick = (e) => {
        let ele = document.getElementById('the-chmt-markblk-canvas-colorpicker');
        let rect = ele.getBoundingClientRect();
        // let objLeft = ele.offsetLeft;
        // let objTop = ele.offsetTop;
        let objLeft = rect.left;
        let objTop = rect.top;

        // 拒绝在左侧空白区标记的请求
        if (e.pageX - objLeft < config.num_canvas_padding_left) {
            return;
        }
        let cv = ele.getContext('2d');
        let color = cv.getImageData(e.pageX - objLeft, e.pageY - objTop, 1, 1).data;
        setPointCorlor(color);

    }

    return (
        <div className='mp-colorpicker'>
            <Modal
                title="取色器"
                visible={props.isColorPickerModalVisible}
                onOk={onOk}
                onCancel={onCancel}
                okText="确认"
                cancelText="取消"
            >

                <div className="mp-vlist">
                    <canvas id="the-chmt-markblk-canvas-colorpicker" className="chmt-markblk-canvas" width={config.num_canvas_width} height={config.num_canvas_height} onClick={(e) => handleCanvasClick(e)} ></canvas>

                    <div className="mp-vlist mp-colorpicker-color-box">
                        <div
                            className='mp-colorpicker-color-rect'
                            style={setColorRectStyle(pointCorlor)}
                        />
                        <p>
                            {setColorStr(pointCorlor)}
                        </p>
                    </div>

                </div>



            </Modal>
        </div>
    );
}
