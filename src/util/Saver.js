import { chromConfig } from './const';


function getCsvHeaderType1 (num) {
    let ans = "第一种相对距离";
    for (let i = 0; i < num; i++) {
        ans += ",关键点-定位点,距离";
    }
    ans += "\n";
    return ans;
}

function getXlsxHeaderType1 (num) {
    let ans = ["第一种相对距离"];
    for (let i = 0; i < num; i++) {
        ans.push("关键点-定位点", "距离")
    }
    return ans;
}

// 标记点-底部基线Z 计算方式被废弃. 原来 标记点-标记点 为 第三种相对距离, 现改为 第二种相对距离
function getCsvHeaderType2 (num) {
    let ans = "第二种相对距离";
    for (let i = 0; i < num; i++) {
        ans += ",标记点-底部基线Z,距离";
    }
    ans += "\n";
    return ans;
}

function getXlsxHeaderType2 (num) {
    let ans = ["第二种相对距离"];
    for (let i = 0; i < num; i++) {
        ans.push("标记点-底部基线Z", "距离")
    }
    return ans;
}

// 原来为 第二种相对距离
function getCsvHeaderType3 (num) {
    let ans = "第二种相对距离";
    for (let i = 0; i < num; i++) {
        ans += ",标记点-标记点,距离";
    }
    ans += "\n";
    return ans;
}

function getXlsxHeaderType3 (num) {
    let ans = ["第二种相对距离"];
    for (let i = 0; i < num; i++) {
        ans.push("标记点-标记点", "距离")
    }
    return ans;
}

function getCsvHeaderType4 (num) {
    let ans = "标记点色谱颜色";
    for (let i = 0; i < num; i++) {
        ans += ",标记点,颜色";
    }
    ans += "\n";
    return ans;
}

function getXlsxHeaderType4 (num) {
    let ans = ["标记点色谱颜色"];
    for (let i = 0; i < num; i++) {
        ans.push("标记点", "颜色")
    }
    return ans;
}

function getCsvHeaderType5 (num) {
    let ans = "第三种相对距离";
    for (let i = 0; i < num; i++) {
        ans += ",标记点-原点,距离";
    }
    ans += "\n";
    return ans;
}

function getXlsxHeaderType5 (num) {
    let ans = ["第三种相对距离"];
    for (let i = 0; i < num; i++) {
        ans.push("标记点-原点", "距离")
    }
    return ans;
}

export function SaveAsCsv (sizeboxData, imgNaturalSize, cropBoxSizeList, markedPoints, scalingRatios) {
    const num_canvas_height = chromConfig.standardMarkCanvasHeight; // 源于 ../components/MarkBlock, 要改一起改
    
    let csv = "";
    

    // 原始单位长度, cm per pixel
    let oriUnitLen = sizeboxData.width / imgNaturalSize.width;
    // let oriUnitLen = 1;

    // ranking 实际上是 逻辑地址转物理地址
    // log2Psy[i][j] 为标号为j的点数组存储的地址
    // psy2Log[i][j] 为数组存储地址为j的点的标号
    let log2Psy = markedPoints.getRanking();
    let psy2Log = [];
    for (let i = 0; i < log2Psy.length; i++) {
        psy2Log.push([]);
        for (let j = 0; j < log2Psy[i].length; j++) {
            let k = 0;
            for (; log2Psy[i][k] !== j; k++) {}
            psy2Log[i].push(k);
        }
    }


    //-- Type 1 Begin

    // 求所有色谱上关键点数目的最大值, 用于决定表头多少列
    let headerNumType1 = 0;
    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        headerNumType1 = Math.max(headerNumType1, markedPoints.mpListGroup[i].list.length - markedPoints.fpListGroup[i].length + 1);
    }
    csv += getCsvHeaderType1(headerNumType1);

    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        csv += `样品${i+1}`;
        for (let j = 0; j < markedPoints.mpListGroup[i].list.length; j++) {
            let keyPoint = markedPoints.getPoint(i, log2Psy[i][j]);
            if (keyPoint.type !== "key" || keyPoint.link < 0) {
                continue; // 非关键点或者没有与之对应的定位点, 跳过
            }
            let fixPoint = markedPoints.getPoint(i, keyPoint.link);

            let dis = Math.abs(keyPoint.y - fixPoint.y) / scalingRatios[i] * oriUnitLen;

            csv += `,${j+1}-${psy2Log[i][keyPoint.link]+1},${dis.toPrecision(5)}`;
        }

        csv += "\n";
    }
    csv += "\n";

    //-- Type 1 End


    //-- Type 2 Begin

    let headerNumType2 = 0;
    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        headerNumType2 = Math.max(headerNumType2, markedPoints.mpListGroup[i].list.length);
    }
    csv += getCsvHeaderType2(headerNumType2);

    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        csv += `样品${i+1}`;
        for (let j = 0; j < markedPoints.mpListGroup[i].list.length; j++) {
            let MarkPoint = markedPoints.getPoint(i, log2Psy[i][j]);
            
            let dis = Math.abs(MarkPoint.y - num_canvas_height) / scalingRatios[i] * oriUnitLen;

            csv += `,${j+1}-Z,${dis.toPrecision(5)}`;
        }

        csv += "\n";
    }
    csv += "\n";

    //-- Type 2 End

    //-- Type 3 Begin
    csv += getCsvHeaderType3(headerNumType2-1);

    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        csv += `样品${i+1}`;
        for (let j = 0; j < markedPoints.mpListGroup[i].list.length-1; j++) {
            let MarkPoint = markedPoints.getPoint(i, log2Psy[i][j]);
            let NextPoint = markedPoints.getPoint(i, log2Psy[i][j+1]);

            let dis = Math.abs(MarkPoint.y - NextPoint.y) / scalingRatios[i] * oriUnitLen;

            csv += `,${j+1}-${j+2},${dis.toPrecision(5)}`;
        }

        csv += "\n";
    }
    csv += "\n";

    //-- Type 3 End

    //-- Type 4 Begin
    csv += getCsvHeaderType4(headerNumType2);

    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        csv += `样品${i+1}`;
        for (let j = 0; j < markedPoints.mpListGroup[i].list.length; j++) {
            let MarkPoint = markedPoints.getPoint(i, log2Psy[i][j]);

            csv += `,${j+1},${MarkPoint.color}`;
        }

        csv += "\n";
    }

    //-- Type 4 End


    return csv;
}

export function SaveAsXlsx (sizeboxData, imgNaturalSize, cropBoxSizeList, markedPoints, scalingRatios) {
    const num_canvas_height = chromConfig.standardMarkCanvasHeight; // 源于 ../components/MarkBlock, 要改一起改
    
    let xlsx = [];
    let row = [];

    // 原始单位长度, cm per pixel
    let oriUnitLen = sizeboxData.width / imgNaturalSize.width;
    // let oriUnitLen = 1;

    // ranking 实际上是 逻辑地址转物理地址
    // log2Psy[i][j] 为标号为j的点数组存储的地址
    // psy2Log[i][j] 为数组存储地址为j的点的标号
    let log2Psy = markedPoints.getRanking();
    let psy2Log = [];
    for (let i = 0; i < log2Psy.length; i++) {
        psy2Log.push([]);
        for (let j = 0; j < log2Psy[i].length; j++) {
            let k = 0;
            for (; log2Psy[i][k] !== j; k++) {}
            psy2Log[i].push(k);
        }
    }


    //-- Type 1 Begin

    // 求所有色谱上关键点数目的最大值, 用于决定表头多少列
    let headerNumType1 = 0;
    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        headerNumType1 = Math.max(headerNumType1, markedPoints.mpListGroup[i].list.length - markedPoints.fpListGroup[i].length + 1);
    }
    xlsx.push(getXlsxHeaderType1(headerNumType1))

    
    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        row = [];
        row.push(`样品${i+1}`);
        for (let j = 0; j < markedPoints.mpListGroup[i].list.length; j++) {
            let keyPoint = markedPoints.getPoint(i, log2Psy[i][j]);
            if (keyPoint.type !== "key" || keyPoint.link < 0) {
                continue; // 非关键点或者没有与之对应的定位点, 跳过
            }
            let fixPoint = markedPoints.getPoint(i, keyPoint.link);

            let dis = Math.abs(keyPoint.y - fixPoint.y) / scalingRatios[i] * oriUnitLen;

            row.push(`${j+1}-${psy2Log[i][keyPoint.link]+1}`, `${dis.toPrecision(5)}`);
        }
        xlsx.push(row);
    }
    xlsx.push([]);

    //-- Type 1 End


    //-- Type 2 Begin

    let headerNumType2 = 0;
    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        headerNumType2 = Math.max(headerNumType2, markedPoints.mpListGroup[i].list.length);
    }
    xlsx.push(getXlsxHeaderType2(headerNumType2))

    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        row = [];
        row.push(`样品${i+1}`);
        for (let j = 0; j < markedPoints.mpListGroup[i].list.length; j++) {
            let MarkPoint = markedPoints.getPoint(i, log2Psy[i][j]);
            
            let dis = Math.abs(MarkPoint.y - num_canvas_height) / scalingRatios[i] * oriUnitLen;

            row.push(`${j+1}-Z`, `${dis.toPrecision(5)}`);
        }
        xlsx.push(row);
    }
    xlsx.push([]);

    //-- Type 2 End

    //-- Type 3 Begin
    xlsx.push(getXlsxHeaderType3(headerNumType2-1))

    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        row = [];
        row.push(`样品${i+1}`);
        for (let j = 0; j < markedPoints.mpListGroup[i].list.length-1; j++) {
            let MarkPoint = markedPoints.getPoint(i, log2Psy[i][j]);
            let NextPoint = markedPoints.getPoint(i, log2Psy[i][j+1]);

            let dis = Math.abs(MarkPoint.y - NextPoint.y) / scalingRatios[i] * oriUnitLen;

            row.push(`${j+1}-${j+2}`, `${dis.toPrecision(5)}`);
        }
        xlsx.push(row);
    }
    xlsx.push([]);

    //-- Type 3 End

    //-- Type 4 Begin
    xlsx.push(getXlsxHeaderType4(headerNumType2))


    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        row = [];
        row.push(`样品${i+1}`);
        for (let j = 0; j < markedPoints.mpListGroup[i].list.length; j++) {
            let MarkPoint = markedPoints.getPoint(i, log2Psy[i][j]);

            row.push(`${j+1}`, `${MarkPoint.color}`);
        }
        xlsx.push(row);
    }

    //-- Type 4 End


    return xlsx;
}






export function SaveAsCsvPlus (sizeboxData, imgNaturalSize, cropBoxSizeList, markedPoints, scalingRatios) {
    const num_canvas_height = chromConfig.standardMarkCanvasHeight; // 源于 ../components/MarkBlock, 要改一起改
    
    let csv = "";
    

    // 原始单位长度, cm per pixel
    let oriUnitLen = sizeboxData.width / imgNaturalSize.width;
    // let oriUnitLen = 1;

    // ranking 实际上是 逻辑地址转物理地址
    // log2Psy[i][j] 为标号为j的点数组存储的地址
    // psy2Log[i][j] 为数组存储地址为j的点的标号
    // let log2Psy = markedPoints.getRanking();
    // let psy2Log = [];
    // for (let i = 0; i < log2Psy.length; i++) {
    //     psy2Log.push([]);
    //     for (let j = 0; j < log2Psy[i].length; j++) {
    //         let k = 0;
    //         for (; log2Psy[i][k] !== j; k++) {}
    //         psy2Log[i].push(k);
    //     }
    // }

    let log2Psy = markedPoints.getRanking();
    let psy2Log = markedPoints.getRankingAndGroup();
    


    //-- Type 1 Begin

    // 求所有色谱上关键点数目的最大值, 用于决定表头多少列
    let headerNumType1 = 0;
    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        headerNumType1 = Math.max(headerNumType1, markedPoints.mpListGroup[i].list.length - markedPoints.fpListGroup[i].length);
    }
    csv += getCsvHeaderType1(headerNumType1);

    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        csv += `样品${i+1}`;
        for (let j = 0; j < markedPoints.mpListGroup[i].list.length; j++) {
            let psy = log2Psy[i][j];
            let keyPoint = markedPoints.getPoint(i, psy);
            if (keyPoint.type !== "key" || keyPoint.link < 0) {
                continue; // 非关键点或者没有与之对应的定位点, 跳过
            }
            let fixPoint = markedPoints.getPoint(i, keyPoint.link);
            
            let keyPointSerialNumber = `${psy2Log[i][psy].group}${psy2Log[i][psy].rank + 1}`
            let fixPointSerialNumber = `${psy2Log[i][keyPoint.link].group}${psy2Log[i][keyPoint.link].rank + 1}`

            let dis = Math.abs(keyPoint.y - fixPoint.y) / scalingRatios[i] * oriUnitLen;

            csv += `,${keyPointSerialNumber}-${fixPointSerialNumber},${dis.toPrecision(5)}`;
        }

        csv += "\n";
    }
    csv += "\n";

    //-- Type 1 End

    //-- Type 3 Begin
    let headerNumType2 = 0;
    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        headerNumType2 = Math.max(headerNumType2, markedPoints.mpListGroup[i].list.length - 1);
    }
    csv += getCsvHeaderType3(headerNumType2-1);

    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        csv += `样品${i+1}`;
        for (let j = 0; j+1 < markedPoints.mpListGroup[i].list.length; j++) {
            let markPointpsy = log2Psy[i][j];
            let MarkPoint = markedPoints.getPoint(i, markPointpsy);
            if (MarkPoint.type === "ori") {
                continue; // 跳过原点
            }

            let nextPointPsy = log2Psy[i][j+1];
            let NextPoint = markedPoints.getPoint(i, log2Psy[i][j+1]);
            if (NextPoint.type === "ori") {
                if (j+1 === markedPoints.mpListGroup[i].list.length - 1) {
                    break;
                } else {
                    nextPointPsy = log2Psy[i][j+2]
                    NextPoint = markedPoints.getPoint(i, log2Psy[i][j+2]);
                }
            }

            let markPointSerialNumber = `${psy2Log[i][markPointpsy].group}${psy2Log[i][markPointpsy].rank + 1}`
            let nextPointSerialNumber = `${psy2Log[i][nextPointPsy].group}${psy2Log[i][nextPointPsy].rank + 1}`

            let dis = Math.abs(MarkPoint.y - NextPoint.y) / scalingRatios[i] * oriUnitLen;

            csv += `,${markPointSerialNumber}-${nextPointSerialNumber},${dis.toPrecision(5)}`;
        }

        csv += "\n";
    }
    csv += "\n";

    //-- Type 3 End

    //-- Type 5 End

    csv += getCsvHeaderType5(headerNumType2-1);

    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        csv += `样品${i+1}`;
        for (let j = 0; j < markedPoints.mpListGroup[i].list.length; j++) {
            let markPointpsy = log2Psy[i][j];
            let MarkPoint = markedPoints.getPoint(i, markPointpsy);
            if (MarkPoint.type === "ori") {
                continue; // 跳过原点
            }
            if (markedPoints.originIdx[i] === -1) {
                break; // 没有原点
            }
            let oriPointPsy = markedPoints.originIdx[i];
            let OriPoint = markedPoints.getPoint(i, oriPointPsy);

            let markPointSerialNumber = `${psy2Log[i][markPointpsy].group}${psy2Log[i][markPointpsy].rank + 1}`
            let oriPointSerialNumber = `${psy2Log[i][oriPointPsy].group}${psy2Log[i][oriPointPsy].rank + 1}`

            let dis = Math.abs(MarkPoint.y - OriPoint.y) / scalingRatios[i] * oriUnitLen;

            csv += `,${markPointSerialNumber}-${oriPointSerialNumber},${dis.toPrecision(5)}`;
        }

        csv += "\n";
    }
    csv += "\n";

    //-- Type 5 End

    //-- Type 4 Begin
    csv += getCsvHeaderType4(headerNumType2);

    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        csv += `样品${i+1}`;
        for (let j = 0; j < markedPoints.mpListGroup[i].list.length; j++) {
            let markPointpsy = log2Psy[i][j];
            let MarkPoint = markedPoints.getPoint(i, markPointpsy);
            if (MarkPoint.type === "ori") {
                continue; // 跳过原点
            }
            let markPointSerialNumber = `${psy2Log[i][markPointpsy].group}${psy2Log[i][markPointpsy].rank + 1}`

            csv += `,${markPointSerialNumber},${MarkPoint.color}`;
        }

        csv += "\n";
    }

    //-- Type 4 End


    return csv;
}

export function SaveAsXlsxPlus (sizeboxData, imgNaturalSize, cropBoxSizeList, markedPoints, scalingRatios) {
    const num_canvas_height = chromConfig.standardMarkCanvasHeight; // 源于 ../components/MarkBlock, 要改一起改
    
    let xlsx = [];
    let row = []
    

    // 原始单位长度, cm per pixel
    let oriUnitLen = sizeboxData.width / imgNaturalSize.width;

    let log2Psy = markedPoints.getRanking();
    let psy2Log = markedPoints.getRankingAndGroup();
    


    //-- Type 1 Begin

    // 求所有色谱上关键点数目的最大值, 用于决定表头多少列
    let headerNumType1 = 0;
    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        headerNumType1 = Math.max(headerNumType1, markedPoints.mpListGroup[i].list.length - markedPoints.fpListGroup[i].length);
    }
    xlsx.push(getXlsxHeaderType1(headerNumType1))

    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        row = [];
        row.push(`样品${i+1}`);
        for (let j = 0; j < markedPoints.mpListGroup[i].list.length; j++) {
            let psy = log2Psy[i][j];
            let keyPoint = markedPoints.getPoint(i, psy);
            if (keyPoint.type !== "key" || keyPoint.link < 0) {
                continue; // 非关键点或者没有与之对应的定位点, 跳过
            }
            let fixPoint = markedPoints.getPoint(i, keyPoint.link);
            
            let keyPointSerialNumber = `${psy2Log[i][psy].group}${psy2Log[i][psy].rank + 1}`
            let fixPointSerialNumber = `${psy2Log[i][keyPoint.link].group}${psy2Log[i][keyPoint.link].rank + 1}`

            let dis = Math.abs(keyPoint.y - fixPoint.y) / scalingRatios[i] * oriUnitLen;

            row.push(`${keyPointSerialNumber}-${fixPointSerialNumber}`, `${dis.toPrecision(5)}`);
        }
        xlsx.push(row);
    }
    xlsx.push([]);

    //-- Type 1 End

    //-- Type 3 Begin
    let headerNumType2 = 0;
    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        headerNumType2 = Math.max(headerNumType2, markedPoints.mpListGroup[i].list.length - 1);
    }
    xlsx.push(getXlsxHeaderType3(headerNumType2-1))
    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        row = [];
        row.push(`样品${i+1}`);
        for (let j = 0; j+1 < markedPoints.mpListGroup[i].list.length; j++) {
            let markPointpsy = log2Psy[i][j];
            let MarkPoint = markedPoints.getPoint(i, markPointpsy);
            if (MarkPoint.type === "ori") {
                continue; // 跳过原点
            }

            let nextPointPsy = log2Psy[i][j+1];
            let NextPoint = markedPoints.getPoint(i, log2Psy[i][j+1]);
            if (NextPoint.type === "ori") {
                if (j+1 === markedPoints.mpListGroup[i].list.length - 1) {
                    break;
                } else {
                    nextPointPsy = log2Psy[i][j+2]
                    NextPoint = markedPoints.getPoint(i, log2Psy[i][j+2]);
                }
            }

            let markPointSerialNumber = `${psy2Log[i][markPointpsy].group}${psy2Log[i][markPointpsy].rank + 1}`
            let nextPointSerialNumber = `${psy2Log[i][nextPointPsy].group}${psy2Log[i][nextPointPsy].rank + 1}`

            let dis = Math.abs(MarkPoint.y - NextPoint.y) / scalingRatios[i] * oriUnitLen;

            row.push(`${markPointSerialNumber}-${nextPointSerialNumber}`, `${dis.toPrecision(5)}`);
        }
        xlsx.push(row);
    }
    xlsx.push([]);

    //-- Type 3 End

    //-- Type 5 End

    xlsx.push(getXlsxHeaderType5(headerNumType2-1))

    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        row = [];
        row.push(`样品${i+1}`);
        for (let j = 0; j < markedPoints.mpListGroup[i].list.length; j++) {
            let markPointpsy = log2Psy[i][j];
            let MarkPoint = markedPoints.getPoint(i, markPointpsy);
            if (MarkPoint.type === "ori") {
                continue; // 跳过原点
            }
            if (markedPoints.originIdx[i] === -1) {
                break; // 没有原点
            }
            let oriPointPsy = markedPoints.originIdx[i];
            let OriPoint = markedPoints.getPoint(i, oriPointPsy);

            let markPointSerialNumber = `${psy2Log[i][markPointpsy].group}${psy2Log[i][markPointpsy].rank + 1}`
            let oriPointSerialNumber = `${psy2Log[i][oriPointPsy].group}${psy2Log[i][oriPointPsy].rank + 1}`

            let dis = Math.abs(MarkPoint.y - OriPoint.y) / scalingRatios[i] * oriUnitLen;

            row.push(`${markPointSerialNumber}-${oriPointSerialNumber}`, `${dis.toPrecision(5)}`);
        }
        xlsx.push(row);
    }
    xlsx.push([]);

    //-- Type 5 End

    //-- Type 4 Begin
    xlsx.push(getXlsxHeaderType4(headerNumType2))
    
    for(let i = 0; i < Math.min(cropBoxSizeList.length, 5); i++) {
        row = [];
        row.push(`样品${i+1}`);
        for (let j = 0; j < markedPoints.mpListGroup[i].list.length; j++) {
            let markPointpsy = log2Psy[i][j];
            let MarkPoint = markedPoints.getPoint(i, markPointpsy);
            if (MarkPoint.type === "ori") {
                continue; // 跳过原点
            }
            let markPointSerialNumber = `${psy2Log[i][markPointpsy].group}${psy2Log[i][markPointpsy].rank + 1}`

            row.push(`${markPointSerialNumber}`, `${MarkPoint.color}`);
        }
        xlsx.push(row);
    }

    //-- Type 4 End


    return xlsx;
}