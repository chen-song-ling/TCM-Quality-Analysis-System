import React, { useState, useEffect } from "react";
import './CropDashboard.css';
import { Upload, Button, Input, Alert } from 'antd';


/* StateType
    sizeboxData: 薄层板大小数据
        width: string
        height: string
        err: string {$ 
            initErr: 初始错误, 位于非正确状态情况下且错误是由于零字符引起的
            widthErr: width非零字符, 且不能转为小数, 且不满足 heightErr
            heightErr: height非零字符, 且不能转为小数, 且不满足 widthErr
            bothErr: 同时满足 widthErr 和 heightErr
            none: 正确
        }
*/

/* Protocol
    uploadSizeboxData()
    uploadImgFile()
    uploadImgFileName()
    triggerDoCrop()
    triggerUndoCrop()  
*/

export default function CropDashboard(props) {
    // const [sizeboxData, setSizeboxData] = useState({width: "", height: "", err: "initErr"});

    const config = {
        text_sizebox_width_left: "宽",
        text_sizebox_width_mid: "薄层板宽度",
        text_sizebox_height_left: "高",
        text_sizebox_height_mid: "薄层板高度",
        text_sizebox_unit: "cm",

        text_instruct_do: "开始裁剪",
        text_instruct_undo: "重新裁剪"
    }

    // 响应式修改薄层板大小
    const onSizeboxChange = (tag, e) => {
        let newone = {...props.sizeboxData};
        if (tag === "width") {
            newone.width = e.target.value;
        } else if (tag === "height") {
            newone.height = e.target.value;
        }

        if (newone.width === "") {
            newone.err = "initErr";
        } else if (isNaN(parseFloat(newone.width))) {
            newone.err = "widthErr";
        } else {
            newone.err = "none";
        }

        if (newone.height === "") {
            if (newone.err === "none") {
                newone.err = "initErr";
            }
        } else if (isNaN(parseFloat(newone.height))) {
            if (newone.err === "widthErr") {
                newone.err = "bothErr";
            } else {
                newone.err = "heightErr";
            }
        } else {
            
        }
        // console.log(parseFloat(newone.width), parseFloat(newone.height));
        // setSizeboxData(newone);
        props.ptc_uploadSizeboxData(newone);
    }

    // 上传文件
    const onImgFileChange = (e) => {
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        if (files[0] === undefined) {
            return
        }
        const reader = new FileReader();
        reader.onload = () => {
            props.ptc_uploadImgFile(reader.result);
            props.ptc_uploadImgFileName(files[0].name);
        };
        reader.readAsDataURL(files[0]);
    }

    const customRequest = (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        const reader = new FileReader();
        reader.onload = () => {
            props.ptc_uploadImgFile(reader.result);
            props.ptc_uploadImgFileName(file.name);
        };
        reader.readAsDataURL(file);
    }

    // 设置提示样式
    const setTipStyle = () => {
        if (props.sizeboxData.err === "none") {
            return "display-none";
        } else if (props.sizeboxData.err === "initErr") {
            return "bg-warning";
        } else {
            return "bg-danger";
        }
    }

    const setTipText = () => {
        if (props.sizeboxData.err === "none") {
            return "";
        } else if (props.sizeboxData.err === "widthErr") {
            return "输入的薄膜板宽度不合法，因为它不是数字";
        } else if (props.sizeboxData.err === "heightErr") {
            return "输入的薄膜板高度不合法，因为它不是数字";
        } else if (props.sizeboxData.err === "bothErr") {
            return "输入的薄膜板高度和宽度不合法，因为它们不是数字";
        } else if (props.sizeboxData.err === "initErr") {
            return "薄膜板尺寸未输入完整";
        }
    }
 
    return (
        <div className="chmt-cropdb">

            <div className="chmt-cropdb-instruct">
                {/* <p> 薄层色谱图裁剪 </p> */}
                {/* <input type="file" onChange={onImgFileChange} /> */}
                <Upload
                    accept="image/*"
                    listType="picture"
                    fileList={[]}
                    customRequest={customRequest}
                >
                    <Button>上传图片</Button>
                </Upload>
                <button className="btn btn-default"
                    onClick={props.ptc_triggerDoCrop} >{config.text_instruct_do}</button>
                <button className="btn btn-default" style={{ marginLeft: 8 }}
                    onClick={props.ptc_triggerUndoCrop} >{config.text_instruct_undo}</button>
            </div>

            <div className="chmt-cropdb-sizebox">
                <Input className="mp-chmt-cropdb-input"
                    addonBefore={config.text_sizebox_width_left}
                    addonAfter={config.text_sizebox_unit}
                    placeholder={config.text_sizebox_width_mid}
                    value={props.sizeboxData.width}
                    onChange={(e)=>onSizeboxChange("width", e)}
                />

                <Input className="mp-chmt-cropdb-input"
                    addonBefore={config.text_sizebox_height_left}
                    addonAfter={config.text_sizebox_unit}
                    placeholder={config.text_sizebox_height_mid}
                    value={props.sizeboxData.height}
                    onChange={(e)=>onSizeboxChange("height", e)}
                />
            </div>

            <Alert className={setTipStyle()} message={setTipText()} type="error" />

        </div>
    );
}
