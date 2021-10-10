class MPoint {
    // link: int, 关键点的关联定位点
    // type: "fix" or "key", 指明点点类型是定位点亦或者是关键点
    constructor(x, y, type, link, color) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.link = link;
        this.color = color;
    }
}

class MPList {
    constructor() {
        this.list = [];
    }
    
    clear() {
        this.list = [];
    }

    push(x, y, type, link, color) {
        this.list.push(new MPoint(x, y, type, link, color));
    }

    pushMp(mp) {
        this.list.push(mp);
    }

    pop() {
        return this.list.pop();
    }

}

export class MPListList {
    // mpListGroup: [MPList], 标记点数组
    // fpListGroup: [[int]], 定位点数组, 用于记录定位点. 数组最后一位为最近一次标记点定位点, -1 为哨兵
    constructor(num) {
        this.mpListGroup = [];
        this.fpListGroup = [];
        for (let i = 0; i < num; i++) {
            this.mpListGroup.push(new MPList());
            this.fpListGroup.push([-1]);
        }
    }

    reinit(num) {
        this.mpListGroup = [];
        this.fpListGroup = [];
        for (let i = 0; i < num; i++) {
            this.mpListGroup.push(new MPList());
            this.fpListGroup.push([-1]);
        }
    }

    // 在 mpListGroup[idx] 推入点
    push(idx, x, y, type, color) {
        let link = this.fpListGroup[idx][this.fpListGroup[idx].length-1];
        this.mpListGroup[idx].pushMp(new MPoint(x, y, type, link, color));
        if (type === "fix") {
            this.fpListGroup[idx].push(this.mpListGroup[idx].list.length-1);
        }
    }

    // 在 mpListGroup[idx] 弹出点
    pop(idx) {
        let point = this.mpListGroup[idx].pop();
        if (point !== undefined && point.type === "fix") {
            this.fpListGroup[idx].pop();
        }
        return point;
    }

    // 清空 mpListGroup[idx]
    clear(idx) {
        this.mpListGroup[idx] = new MPList();
        this.fpListGroup[idx] = [-1];
    }

    fakeCopy() {
        let newone = new MPListList();
        newone.fpListGroup = this.fpListGroup;
        newone.mpListGroup = this.mpListGroup;
        return newone;
    }

    getPoint(idx, jdx) {
        return this.mpListGroup[idx].list[jdx];
    }

    getRanking() {
        let ranking = [];
        for (let i = 0; i < this.mpListGroup.length; i++) {
            ranking.push([]);
            for (let j = 0; j < this.mpListGroup[i].list.length; j++) {
                ranking[i].push(j);
            }
            ranking[i].sort((a, b) => {
                return this.getPoint(i, a).y - this.getPoint(i, b).y;
            });
        }
        
        return ranking;
    }

    
}