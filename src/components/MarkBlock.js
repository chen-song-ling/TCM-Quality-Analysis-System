import React, { useState, useEffect } from "react";
import "./MarkBlock.css";
import { MPListList } from "../unities/MPListList";

/* StateType
    focusedCv: 目前聚焦的canvas编号
        _: int 
        -1表示没有聚焦
    MPListList: 存储标记的点
*/

/* Protocol
    uploadMarkedPoints()
    uploadScalingRatios()
*/

export default function MarkBlock(props) {
    const [focusedCv, setFocusedCv] = useState(-1);
    const [markedPoints, setMarkedPoints] = useState(new MPListList(5));
    const [scalingRatios, setScalingRatios] = useState([0, 0, 0, 0, 0]);

    const config = {
        num_canvas_width: 85,
        num_canvas_height: 400, // ../util/Saver 下也有这个依赖
        num_canvas_padding_left: 25,
        num_canvas_number_size: 18,
    }

    const reinit = () => {
        setMarkedPoints(new MPListList(5));
        setScalingRatios([0, 0, 0, 0, 0]);
        clearAll();
    }

    // 把裁剪的图片放到标记栏
    useEffect(() => {
        // 如果是空的, 回到初始态
        if (props.cropImgList.length === 0) {
            reinit();
        }

        for (let idx=0; idx<5; idx++) {
            if (idx < props.cropImgList.length) {
                reDrawImgAndPoints(idx, markedPoints);
                // drawPointGroup(idx, markedPoints);
            } else {
                clearCanvas(idx);
            }
        }
        
    }, [props.cropImgList.length]);

    // 点击撤销按钮
    useEffect(() => {
        undoMarkPoint();
    }, [props.undoMark]);

    // 点击清空按钮
    useEffect(() => {
        clearMark();
    }, [props.clearMark]);

    // 点击编号按钮
    useEffect(() => {
        numberMark();
    }, [props.numberMark]);

    // 上传标记点信息
    useEffect(() => {
        props.ptc_uploadMarkedPoints(markedPoints);
    }, [markedPoints])

    // 上传缩放尺度信息
    useEffect(() => {
        props.ptc_uploadScalingRatios(scalingRatios);
    }, [scalingRatios])

    //-- Draw Begin

    // 清空并重画
    const reDrawImgAndPoints = (id, safeMarkedPoints) => {
        let cid = "the-chmt-markblk-canvas-" + id;
        let cv = document.getElementById(cid)?.getContext('2d');
        if (cv === undefined || props.cropBoxSizeList.length <= id) {
            return;
        }

        let ow = props.cropBoxSizeList[id].width;
        let oh = props.cropBoxSizeList[id].height;
        let scalingRatio = Math.min(config.num_canvas_height / oh, (config.num_canvas_width-config.num_canvas_padding_left) / ow);
        
        let newScalingRatios = [...scalingRatios];
        newScalingRatios[id] = scalingRatio;
        setScalingRatios(newScalingRatios);

        let w = ow*scalingRatio;
        let h = oh*scalingRatio;
        let x = config.num_canvas_width-w;
        let y = config.num_canvas_height-h;

        let img = new Image();
        img.src = props.cropImgList[id];

        img.onload = () => {
            cv.clearRect(0, 0, config.num_canvas_width, config.num_canvas_height);
            cv.drawImage(img, x, y, w, h);
            drawPointGroup(id, safeMarkedPoints);
        };
    }

    // 清空画布
    const clearCanvas = (id) => {
        let cid = "the-chmt-markblk-canvas-" + id;
        let cv = document.getElementById(cid)?.getContext('2d');
        if (cv === undefined) {
            return;
        }
        cv.clearRect(0, 0, config.num_canvas_width, config.num_canvas_height);
    }

    // 清空所有画布
    const clearAll = () => {
        for (let i = 0; i < 5; i++) {
            let cid = "the-chmt-markblk-canvas-" + i;
            let cv = document.getElementById(cid)?.getContext('2d');
            if (cv === undefined) {
                continue;
            }
            cv.clearRect(0, 0, config.num_canvas_width, config.num_canvas_height);
        }
    }

    // 绘制一个标记点
    const drawPoint = (id, x, y, type) => {
        let cv = document.getElementById("the-chmt-markblk-canvas-" + id)?.getContext('2d');
        if (cv === undefined) {
            return;
        }
        cv.beginPath();
        cv.lineWidth = 2;
        if (type === "fix") {
            cv.strokeStyle = "red";
        } else if (type === "key") {
            cv.strokeStyle = "rgb(95, 207, 82)";
        }

        cv.moveTo(x, y);
        cv.arc(x, y, 2, 0, Math.PI * 2, false); // false 代表顺时针旋转
        cv.stroke();

        cv.beginPath();
        cv.lineWidth = 1;
        cv.strokeStyle = "black";
        cv.moveTo(x, y);
        cv.arc(x, y, 4, 0, Math.PI * 2, false);
        cv.stroke();
    }

    // 绘制一条色谱的标记点. 由于 state 可能会有延迟, 需要手动指定 markedPoints 来源
    const drawPointGroup = (id, safeMarkedPoints) => {
        let l = safeMarkedPoints.mpListGroup[id].list.length;
        for (let j = 0; j < l; j++) {
            let p = safeMarkedPoints.getPoint(id, j);
            drawPoint(id, p.x, p.y, p.type);
        }
    }

    //-- Draw End

    // 处理画布点击事件
    // 未拉直
    // const handleCanvasClick = (id, e) => {
    //     if (focusedCv === id && (props.markMode === "fix" || props.markMode === "key") && id < props.cropImgList.length) {
    //         let ele = document.getElementById('the-chmt-markblk-canvas-' + id);
    //         let objLeft = ele.offsetLeft;
    //         let objTop = ele.offsetTop;

    //         // 拒绝在左侧空白区标记的请求
    //         if (e.pageX-objLeft < config.num_canvas_padding_left) {
    //             return;
    //         }

    //         // 获取颜色
    //         let cv = ele.getContext('2d');
    //         let color = cv.getImageData(e.pageX-objLeft, e.pageY-objTop, 1, 1).data;
    //         let cnum = 0;
    //         for (let i = 0; i < 3; i++) {
    //             cnum = cnum * 256 + color[i];
    //         }

    //         let newMarkedPoints = markedPoints.fakeCopy(); // { ...markedPoints }
    //         newMarkedPoints.push(id, e.pageX-objLeft, e.pageY-objTop, props.markMode, cnum.toString(16).toUpperCase().padStart(6, "0"));
    //         setMarkedPoints(newMarkedPoints);

    //         drawPoint(id, e.pageX-objLeft, e.pageY-objTop, props.markMode);
    //     }
    // }
    // 拉直
    const handleCanvasClick = (id, e) => {
        if (focusedCv === id && (props.markMode === "fix" || props.markMode === "key") && id < props.cropImgList.length) {
            let ele = document.getElementById('the-chmt-markblk-canvas-' + id);
            let objLeft = ele.offsetLeft;
            let objTop = ele.offsetTop;

            // 拒绝在左侧空白区标记的请求
            if (e.pageX-objLeft < config.num_canvas_padding_left) {
                return;
            }

            // 获取颜色
            let cv = ele.getContext('2d');
            let color = cv.getImageData(e.pageX-objLeft, e.pageY-objTop, 1, 1).data;
            // let cnum = 0;
            // for (let i = 0; i < 3; i++) {
            //     cnum = cnum * 256 + color[i];
            // }

            let cstr = "(" + color[0] + "; " + color[1] + "; " + color[2] + ")";
            

            let imgw = props.cropBoxSizeList[id].width * scalingRatios[id];

            let newMarkedPoints = markedPoints.fakeCopy(); // { ...markedPoints }
            // newMarkedPoints.push(id, config.num_canvas_width - (imgw / 2), e.pageY-objTop, props.markMode, cnum.toString(16).toUpperCase().padStart(6, "0"));
            newMarkedPoints.push(id, config.num_canvas_width - (imgw / 2), e.pageY-objTop, props.markMode, cstr);

            setMarkedPoints(newMarkedPoints);

            drawPoint(id, config.num_canvas_width - (imgw / 2), e.pageY-objTop, props.markMode);
        }
    }

    // 处理按钮点击事件
    const handleBtnClick = (id) => {
        if (id === focusedCv) {
            setFocusedCv(-1);
        } else {
            setFocusedCv(id);
        }
    }

    // 执行撤销点
    const undoMarkPoint = () => {
        if (focusedCv !== -1) {
            let newMarkedPoints = markedPoints.fakeCopy();
            newMarkedPoints.pop(focusedCv);
            setMarkedPoints(newMarkedPoints);

            reDrawImgAndPoints(focusedCv, newMarkedPoints);
        }
    }

    // 执行清空点
    const clearMark = () => {
        if (focusedCv !== -1) {
            let newMarkedPoints = markedPoints.fakeCopy();
            newMarkedPoints.clear(focusedCv);
            setMarkedPoints(newMarkedPoints);

            reDrawImgAndPoints(focusedCv, newMarkedPoints);
        }
    }

    // 执行编号任务
    const numberMark = () => {
        let ranking = markedPoints.getRanking();

        for (let id = 0; id < 5; id++) {
            
            let cid = "the-chmt-markblk-canvas-" + id;
            let cv = document.getElementById(cid)?.getContext('2d');
            if (cv === undefined) {
                return;
            }

            cv.clearRect(0, 0, config.num_canvas_padding_left - 3, config.num_canvas_height);

            cv.font = config.num_canvas_number_size + "px serif";
            cv.fillStyle = "black";
            // ctx.textBaseline = "hanging";

            for (let j in ranking[id]) {
                let num = parseInt(j)+1;
                cv.fillText(num, 0, markedPoints.getPoint(id, ranking[id][j]).y + config.num_canvas_number_size / 2);
            }
            
        }
    }


    const setBtnStyle = (id) => {
        if (id === focusedCv) {
            return "btn btn-success chmt-markblk-btn";
        } else {
            return "btn btn-default chmt-markblk-btn";
        }
    };


    return (
        <div className="chmt-markblk">
            {/* {JSON.stringify(markedPoints)} */}
            <div className="chmt-markblk-group">
                <canvas id="the-chmt-markblk-canvas-0" className="chmt-markblk-canvas" width={config.num_canvas_width} height={config.num_canvas_height} onClick={(e)=>handleCanvasClick(0, e)} ></canvas>
                <button type="button" className={setBtnStyle(0)}  onClick={()=>handleBtnClick(0)}>样品1</button>
            </div>

            <div className="chmt-markblk-group">
                <canvas id="the-chmt-markblk-canvas-1" className="chmt-markblk-canvas" width={config.num_canvas_width} height={config.num_canvas_height} onClick={(e)=>handleCanvasClick(1, e)} ></canvas>
                <button type="button" className={setBtnStyle(1)} onClick={()=>handleBtnClick(1)}>样品2</button>
            </div>

            <div className="chmt-markblk-group">
                <canvas id="the-chmt-markblk-canvas-2" className="chmt-markblk-canvas" width={config.num_canvas_width} height={config.num_canvas_height} onClick={(e)=>handleCanvasClick(2, e)} ></canvas>
                <button type="button" className={setBtnStyle(2)}  onClick={()=>handleBtnClick(2)}>样品3</button>
            </div>

            <div className="chmt-markblk-group">
                <canvas id="the-chmt-markblk-canvas-3" className="chmt-markblk-canvas" width={config.num_canvas_width} height={config.num_canvas_height} onClick={(e)=>handleCanvasClick(3, e)} ></canvas>
                <button type="button" className={setBtnStyle(3)}  onClick={()=>handleBtnClick(3)}>样品4</button>
            </div>

            <div className="chmt-markblk-group">
                <canvas id="the-chmt-markblk-canvas-4" className="chmt-markblk-canvas" width={config.num_canvas_width} height={config.num_canvas_height} onClick={(e)=>handleCanvasClick(4, e)} ></canvas>
                <button type="button" className={setBtnStyle(4)}  onClick={()=>handleBtnClick(4)}>样品5</button>
            </div>

        </div>
    )
}
