import React, { useState, useEffect } from "react";
import { chromConfig } from "../util/const";
import './HighPrecCntr.css';

export default function HighPrecCntr(props) {
    const [precScalingRatio, setPrecScalingRatio] = useState(0);

    const preccid = "the-chmt-markblk-prec-canvas";

    useEffect(() => {
        if (props.focusedCv === -1 || props.focusedCv >= props.cropImgList.length) {
            clearCanvas();
        } else if (props.focusedCv < props.cropImgList.length) {
            reDrawImgAndPoints(props.focusedCv, props.markedPoints);
        }
    }, [props.focusedCv]);

    useEffect(() => {
        // document.getElementById(preccid).style.cursor="crosshair";
    }, [])

    useEffect(() => {
        if (props.preciseDrawInfo.func !== null) {
            if (props.preciseDrawInfo.func === "undo") {
                if (props.preciseDrawInfo.mps !== null && props.preciseDrawInfo.id === props.focusedCv) {
                    reDrawImgAndPoints(props.preciseDrawInfo.id, props.preciseDrawInfo.mps);
                }
            } else if (props.preciseDrawInfo.func === "clear") {
                if (props.preciseDrawInfo.mps !== null && props.preciseDrawInfo.id === props.focusedCv) {
                    reDrawImgAndPoints(props.preciseDrawInfo.id, props.preciseDrawInfo.mps);
                }
            } else if (props.preciseDrawInfo.func === "number") {
                if (props.focusedCv !== -1) {
                    numberMark();
                }
            }
        } else if (props.focusedCv === props.preciseDrawInfo.id && props.focusedCv !== -1) {
            drawPointWithStandardMarkCoor(props.preciseDrawInfo.x, props.preciseDrawInfo.y, props.preciseDrawInfo.type);
        }
    }, [props.preciseDrawInfo]);

    const clearCanvas = () => {
        let cv = document.getElementById(preccid)?.getContext('2d');
        if (cv === undefined) {
            return;
        }
        cv.clearRect(0, 0, chromConfig.precisedMarkCanvasWidth, chromConfig.precisedMarkCanvasHeight);
    }

    const reDrawImgAndPoints = (id, safeMarkedPoints) => {
        let cv = document.getElementById(preccid)?.getContext('2d');
        if (cv === undefined) {
            return;
        }
        let ow = props.cropBoxSizeList[id].width;
        let oh = props.cropBoxSizeList[id].height;
        let precScalingRatio = Math.min(chromConfig.precisedMarkCanvasWidth / oh, (chromConfig.precisedMarkCanvasHeight-chromConfig.precisedMarkCanvasPaddingTop) / ow);
        setPrecScalingRatio(precScalingRatio);

        let w = ow*precScalingRatio;
        let h = oh*precScalingRatio;
        let x = -w;
        let y = (chromConfig.precisedMarkCanvasWidth-h);

        let img = new Image();
        img.src = props.cropImgList[id];

        img.onload = () => {
            cv.clearRect(0, 0, chromConfig.precisedMarkCanvasWidth, chromConfig.precisedMarkCanvasHeight);
            cv.rotate(-Math.PI / 2);
            cv.drawImage(img, x, y, w, h);
            cv.rotate(Math.PI / 2);
            // drawPointGroup(id, safeMarkedPoints);
            drawPointGroup(props.focusedCv, safeMarkedPoints);
        };
    }

    const handleCanvasClick = (e) => {
        if (props.focusedCv !== -1 && (props.markMode === "fix" || props.markMode === "key" || props.markMode === "ori") && props.focusedCv < props.cropImgList.length) {
            let ele = document.getElementById(preccid);
            let objLeft = ele.offsetLeft;
            let objTop = ele.offsetTop;

            // 拒绝在下方侧空白区标记的请求
            if (e.pageY-objTop > chromConfig.precisedMarkCanvasHeight) {
                return;
            }

            // 已经有原点了
            if (props.markedPoints.isOriginPointExisted(props.focusedCv) && props.markMode === "ori") {
                return;
            }

            // 获取颜色
            let cv = ele.getContext('2d');
            let color = cv.getImageData(e.pageX-objLeft, e.pageY-objTop, 1, 1).data;
            let cstr = "(" + color[0] + "; " + color[1] + "; " + color[2] + ")";

            let imgw = props.cropBoxSizeList[props.focusedCv].width * precScalingRatio;
            let imageHeightInStandardMarkCanvase = props.cropBoxSizeList[props.focusedCv].height * props.scalingRatios[props.focusedCv];
            let topSpaceHeightInStandardMarkCanvase = chromConfig.standardMarkCanvasHeight - imageHeightInStandardMarkCanvase;
            let leftSpaceWidth = chromConfig.precisedMarkCanvasWidth - props.cropBoxSizeList[props.focusedCv].height * precScalingRatio;
            let disBetweenImageTopAndPoint = e.pageX-objLeft - leftSpaceWidth;

            let newMarkedPoints = props.markedPoints.fakeCopy();
            let a = props.scalingRatios[props.focusedCv] / precScalingRatio;
            newMarkedPoints.push(props.focusedCv, chromConfig.standardMarkCanvasWidth - (imgw / 2 * a), disBetweenImageTopAndPoint * a + topSpaceHeightInStandardMarkCanvase, props.markMode, cstr);
            props.ptc_uploadMarkedPoints(newMarkedPoints);

            props.ptc_uploadDrawPointToStandardCanvas(props.focusedCv,
                chromConfig.standardMarkCanvasWidth - (imgw / 2 * a),
                disBetweenImageTopAndPoint * a + topSpaceHeightInStandardMarkCanvase,
                props.markMode);
            drawPointWithStandardMarkCoor(chromConfig.standardMarkCanvasWidth - (imgw / 2 * a), disBetweenImageTopAndPoint * a + topSpaceHeightInStandardMarkCanvase, props.markMode);
        }
    }

    // 绘制一个标记点, 使用小标记区的坐标体系
    const drawPointWithStandardMarkCoor = (x, y, type) => {
        let a = props.scalingRatios[props.focusedCv] / precScalingRatio;
        let imgwInStandardMarkCanvase = props.cropBoxSizeList[props.focusedCv].width * props.scalingRatios[props.focusedCv];
        let imageHeightInStandardMarkCanvase = props.cropBoxSizeList[props.focusedCv].height * props.scalingRatios[props.focusedCv];
        let topSpaceHeightInStandardMarkCanvase = chromConfig.standardMarkCanvasHeight - imageHeightInStandardMarkCanvase;
        let leftSpaceWidth = chromConfig.precisedMarkCanvasWidth - props.cropBoxSizeList[props.focusedCv].height * precScalingRatio;

        let px = (y - topSpaceHeightInStandardMarkCanvase) / a + leftSpaceWidth;
        // let py = (imgwInStandardMarkCanvase - (x - chromConfig.standardMarkCanvasPaddingLeft)) / a;
        let py = imgwInStandardMarkCanvase/a/2;

        let cv = document.getElementById(preccid)?.getContext('2d');
        if (cv === undefined) {
            return;
        }
        cv.beginPath();
        cv.lineWidth = 2;
        if (type === "fix") {
            cv.strokeStyle = chromConfig.fixPointColor;
        } else if (type === "key") {
            cv.strokeStyle = chromConfig.keyPointColor;
        } else if (type === "ori") {
            cv.strokeStyle = chromConfig.oriPointColor;
        }

        cv.moveTo(px, py);
        cv.arc(px, py, 2, 0, Math.PI * 2, false); // false 代表顺时针旋转
        cv.stroke();

        cv.beginPath();
        cv.lineWidth = 1;
        cv.strokeStyle = "black";
        cv.moveTo(px, py);
        cv.arc(px, py, 4, 0, Math.PI * 2, false);
        cv.stroke();

    }

    const drawPointGroup = (id, safeMarkedPoints) => {
        let l = safeMarkedPoints.mpListGroup[id].list.length;
        for (let j = 0; j < l; j++) {
            let p = safeMarkedPoints.getPoint(id, j);
            drawPointWithStandardMarkCoor(p.x, p.y, p.type);
        }
    }

    const numberMark = () => {
        let a = props.scalingRatios[props.focusedCv] / precScalingRatio;
        let imgwInStandardMarkCanvase = props.cropBoxSizeList[props.focusedCv].width * props.scalingRatios[props.focusedCv];
        let imageHeightInStandardMarkCanvase = props.cropBoxSizeList[props.focusedCv].height * props.scalingRatios[props.focusedCv];
        let topSpaceHeightInStandardMarkCanvase = chromConfig.standardMarkCanvasHeight - imageHeightInStandardMarkCanvase;
        let leftSpaceWidth = chromConfig.precisedMarkCanvasWidth - props.cropBoxSizeList[props.focusedCv].height * precScalingRatio;

        let rankingAndGroup = props.markedPoints.getRankingAndGroup();
        let id = props.focusedCv;
        let cv = document.getElementById(preccid)?.getContext('2d');
        if (cv === undefined) {
            return;
        }
        cv.clearRect(0,
            chromConfig.precisedMarkCanvasHeight-chromConfig.precisedMarkCanvasPaddingTop + 3, 
            chromConfig.precisedMarkCanvasWidth,
            chromConfig.precisedMarkCanvasPaddingTop);

        cv.font = chromConfig.precisedMarkCanvasFontsize + "px serif";
        cv.fillStyle = "black";
        for (let p = 0; p < rankingAndGroup[id].length; p++) {
            let item = rankingAndGroup[id][p];
            let num = parseInt(item.rank)+1;
            let y = props.markedPoints.getPoint(id, p).y;
            cv.fillText(`${item.group}${num}`, leftSpaceWidth+(y-topSpaceHeightInStandardMarkCanvase)/a-chromConfig.precisedMarkCanvasFontsize/2, chromConfig.precisedMarkCanvasHeight); 
        }
    }


    return (
        <div className="chmt-highpreccntr mp-vlist">
            <canvas id={preccid}className="chmt-markblk-prec-canvas" width={chromConfig.precisedMarkCanvasWidth} height={chromConfig.precisedMarkCanvasHeight} onClick={(e)=>handleCanvasClick(e)} ></canvas>
        </div>
    );
}
