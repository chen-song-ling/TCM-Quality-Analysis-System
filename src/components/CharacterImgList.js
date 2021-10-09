import React from 'react';
import { useEffect } from "react";
import './CharacterImgList.css';

export default function CharacterImgList(props) {

    const config = {
        num_canvas_width: 180,
        num_canvas_height: 180,
    }

    useEffect(() => {
        if (props.characterImgGroup === null || props.characterImgAiInfo === undefined) {

        } else {
            let ow = props.cropBoxSize.width / 3;
            let oh = props.cropBoxSize.height / 3;
            let scalingRatio = Math.min(config.num_canvas_height / oh, config.num_canvas_width / ow);

            let w = ow*scalingRatio;
            let h = oh*scalingRatio;
            let x = (config.num_canvas_width-w)/2;
            let y = (config.num_canvas_height-h)/2;

            for (let i = 0; i < props.characterImgGroup.length; i++) {
                let cid = "the-charimglist-canvas-sample-" + i;
                let cv = document.getElementById(cid)?.getContext('2d');
                if (cv === undefined) {
                    continue;
                }
                
                let img = new Image();
                img.src = props.characterImgGroup[i];

                img.onload = () => {
                    cv.clearRect(0, 0, config.num_canvas_width, config.num_canvas_height);
                    cv.drawImage(img, x, y, w, h);
                };
            }
        }

    }, [props.characterImgGroup]);

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
                    <p>lalala</p>
                </div>
            );
        }
    }

    const renderRow = (idx) => {
        return (
            <div className="mp-charimglist-row mp-hlist" key={idx}>
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
            <div className="mp-charimglist">
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