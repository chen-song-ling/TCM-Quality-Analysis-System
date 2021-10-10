function getCsvHeaderType1 (num) {
    let ans = "第一种相对距离";
    for (let i = 0; i < num; i++) {
        ans += ",关键点-定位点,距离";
    }
    ans += "\n";
    return ans;
}

function getCsvHeaderType2 (num) {
    let ans = "第二种相对距离";
    for (let i = 0; i < num; i++) {
        ans += ",标记点-底部基线Z,距离";
    }
    ans += "\n";
    return ans;
}

function getCsvHeaderType3 (num) {
    let ans = "第三种相对距离";
    for (let i = 0; i < num; i++) {
        ans += ",标记点-标记点,距离";
    }
    ans += "\n";
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

export function SaveAsCsv (sizeboxData, imgNaturalSize, cropBoxSizeList, markedPoints, scalingRatios) {
    const num_canvas_height = 400; // 源于 ../components/MarkBlock, 要改一起改
    
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