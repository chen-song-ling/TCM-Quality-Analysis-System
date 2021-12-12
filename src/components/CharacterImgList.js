import React from 'react';
import { useEffect } from "react";
import './CharacterImgList.css';
import { baseStaticUrl } from '../util/const';

export default function CharacterImgList(props) {

    var originalImg = null;
    if (props.originalImg !== undefined) {
        originalImg = props.originalImg;
    }

    const config = {
        num_canvas_width: 180,
        num_canvas_height: 180,
        // base_url: "http://lab2.tery.top:8080/static/",
        base_url: baseStaticUrl,
    }

    useEffect(() => {
        if (props.characterImgGroup === null || props.characterStandardImgGroup === null || props.characterImgAiInfo === null) {

        } else {
            // 切好的样本图
            for (let i = 0; i < props.characterImgGroup.length; i++) {
                let cid = "the-charimglist-canvas-sample-" + i;
                let cv = document.getElementById(cid)?.getContext('2d');
                if (cv === undefined) {
                    continue;
                }

                let img = new Image();
                img.src = config.base_url + props.characterImgGroup[i];
                img.onload = () => {
                    // let ow = props.cropBoxSize.width / 3;
                    // let oh = props.cropBoxSize.height / 3;
                    let ow = img.width;
                    let oh = img.height;
                    let scalingRatio = Math.min(config.num_canvas_height / oh, config.num_canvas_width / ow);

                    let w = ow * scalingRatio;
                    let h = oh * scalingRatio;
                    let x = (config.num_canvas_width - w) / 2;
                    let y = (config.num_canvas_height - h) / 2;

                    cv.clearRect(0, 0, config.num_canvas_width, config.num_canvas_height);
                    cv.drawImage(img, x, y, w, h);
                };
            }

            // 标准图
            for (let i = 0; i < props.characterStandardImgGroup.length; i++) {
                let cid = "the-charimglist-canvas-standard-" + i;
                let cv = document.getElementById(cid)?.getContext('2d');
                if (cv === undefined) {
                    continue;
                }

                let img = new Image();
                img.src = config.base_url + props.characterStandardImgGroup[i];

                img.onload = () => {
                    let ow = img.width;
                    let oh = img.height;
                    let scalingRatio = Math.min(config.num_canvas_height / oh, config.num_canvas_width / ow);

                    let w = ow * scalingRatio;
                    let h = oh * scalingRatio;
                    let x = (config.num_canvas_width - w) / 2;
                    let y = (config.num_canvas_height - h) / 2;

                    cv.clearRect(0, 0, config.num_canvas_width, config.num_canvas_height);
                    cv.drawImage(img, x, y, w, h);
                };
            }
        }
    }, [props.characterImgGroup, props.characterStandardImgGroup, props.characterImgAiInfo]);

    const renderAiInfo = (idx) => {
        if (props.characterImgAiInfo === null || props.characterImgAiInfo === undefined || props.characterImgAiInfo.length <= idx) {
            return (
                <div>
                    <p>null</p>
                </div>
            );
        } else {
            return (
                <div>
                    <p>{props.characterImgAiInfo[idx]}</p>
                </div>
            );
        }
    }

    const renderRow = (idx) => {
        return (
            <div className="mp-charimglist-row mp-hlist" key={idx}>
                <div className="mp-charimglist-row-num mp-vlist">
                    {idx + 1}
                </div>
                <div className="mp-charimglist-row-left mp-vlist">
                    <canvas id={"the-charimglist-canvas-sample-" + idx} className="mp-crtimglst-canvas" width={config.num_canvas_width} height={config.num_canvas_height} ></canvas>
                </div>
                <div className="mp-charimglist-row-mid mp-vlist">
                    <canvas id={"the-charimglist-canvas-standard-" + idx} className="mp-crtimglst-canvas" width={180} height={180} ></canvas>
                </div>
                <div className="mp-charimglist-row-right mp-vlist">
                    {renderAiInfo(idx)}
                </div>
            </div>
        );
    }


    const renderOriginalImg = () => {
        if (originalImg !== null) {
            return (
                <div className="mp-vlist">
                    <div className="mp-charimglist-row-head mp-vlist">
                        <p>原始图</p>
                    </div>
                    <img className="mp-charimglist-ori-img" src={originalImg} />
                </div>
            );
        } else {
            return null;
        }
    }


    if (props.characterImgGroup === null || props.characterImgGroup === undefined) {
        return (
            <div className="mp-charimglist"></div>
        );
    } else {
        let rows = [];
        for (let i = 0; i < props.characterImgGroup.length; i++) {
            rows.push(renderRow(i));
        }
        return (
            <div className="mp-charimglist mp-vlist">

                {renderOriginalImg()}

                <div className="mp-charimglist-row mp-hlist">
                    <div className="mp-charimglist-row-head mp-vlist">
                        <p>截取图</p>
                    </div>
                    <div className="mp-charimglist-row-head mp-vlist">
                        <p>标准图</p>
                    </div>
                    <div className="mp-charimglist-row-head mp-vlist">
                        <p>识别信息</p>
                    </div>
                </div>
                {rows}
            </div>
        );
    };

}