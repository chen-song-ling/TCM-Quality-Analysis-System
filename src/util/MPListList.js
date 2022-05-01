class MPoint {
    // link: int, 关键点的关联定位点
    // type: "fix" or "key", 指明点点类型是定位点亦或者是关键点
    // type: "ori", 原点
    // type: "esc", 逃逸点
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
    // originIdx: 原点序号
    constructor(x) {
        if (typeof x === "number") {
            this.mpListGroup = [];
            this.fpListGroup = [];
            this.originIdx = [];
            for (let i = 0; i < x; i++) {
                this.mpListGroup.push(new MPList());
                this.fpListGroup.push([-1]);
                this.originIdx.push(-1);
            }
        } else if (typeof x === "string") {
            let obj = JSON.parse(x);
            this.mpListGroup = [];
            this.fpListGroup = obj.fpListGroup;
            this.originIdx = obj.originIdx;
            for (let i = 0; i < obj.mpListGroup.length; i++) {
                this.mpListGroup.push(new MPList());
                for (let j = 0; j < obj.mpListGroup[i].list.length; j++) {
                    this.mpListGroup[i].pushMp(new MPoint(obj.mpListGroup[i].list[j].x, obj.mpListGroup[i].list[j].y, obj.mpListGroup[i].list[j].type, obj.mpListGroup[i].list[j].link, obj.mpListGroup[i].list[j].color));
                }
            }
        } else if (typeof x === "object") {
            let obj = x;
            this.mpListGroup = [];
            this.fpListGroup = obj.fpListGroup;
            this.originIdx = obj.originIdx;
            for (let i = 0; i < obj.mpListGroup.length; i++) {
                this.mpListGroup.push(new MPList());
                for (let j = 0; j < obj.mpListGroup[i].list.length; j++) {
                    this.mpListGroup[i].pushMp(new MPoint(obj.mpListGroup[i].list[j].x, obj.mpListGroup[i].list[j].y, obj.mpListGroup[i].list[j].type, obj.mpListGroup[i].list[j].link, obj.mpListGroup[i].list[j].color));
                }
            }
        }
    }

    reinit(num) {
        this.mpListGroup = [];
        this.fpListGroup = [];
        this.originIdx = [];
        for (let i = 0; i < num; i++) {
            this.mpListGroup.push(new MPList());
            this.fpListGroup.push([-1]);
            this.originIdx.push(-1);
        }
    }

    // 在 mpListGroup[idx] 推入点
    push(idx, x, y, type, color) {
        let link = -1;
        if (type === "key") {
            link = this.fpListGroup[idx][this.fpListGroup[idx].length-1];
        } else if (type === "fix") {
            link = this.mpListGroup[idx].list.length;
            this.fpListGroup[idx].push(this.mpListGroup[idx].list.length);
        } else if (type === "ori") {
            link = -1;
            this.originIdx[idx] = this.mpListGroup[idx].list.length;
        } else if (type === "esc") {
            link = this.fpListGroup[idx][this.fpListGroup[idx].length-1];
        }
        this.mpListGroup[idx].pushMp(new MPoint(x, y, type, link, color));
    }

    // 在 mpListGroup[idx] 弹出点
    pop(idx) {
        let point = this.mpListGroup[idx].pop();
        if (point !== undefined && point.type === "fix") {
            this.fpListGroup[idx].pop();
        } else if (point.type === "ori") {
            this.originIdx[idx] = -1;
        }
        return point;
    }

    // 清空 mpListGroup[idx]
    clear(idx) {
        this.mpListGroup[idx] = new MPList();
        this.fpListGroup[idx] = [-1];
    }

    // 判断是否存在原点
    isOriginPointExisted(idx) {
        return this.originIdx[idx] !== -1;
    }

    fakeCopy() {
        let newone = new MPListList();
        newone.fpListGroup = this.fpListGroup;
        newone.mpListGroup = this.mpListGroup;
        newone.originIdx = this.originIdx;
        return newone;
    }

    getPoint(idx, jdx) {
        return this.mpListGroup[idx].list[jdx];
    }

    // 假如返回值为 [2, 3, 0, 1]
    // 说明序号 0 应为 mpListGroup里的第 2 个点
    // 说明序号 1 应为 mpListGroup里的第 3 个点
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

    // 第 idx 个元素为 {rank, group}, 表示
    // mpListGroup里的第 idx 个点的标号为 rank, 组别为 group
    // 与 getRanking() 命名类似, 但意思不一致, 具有迷惑性
    getRankingAndGroup() {
        let rankingAndGroup = [];
        let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let ranking = this.getRanking();
        // console.log(ranking);
        // console.log(this);
        for (let i = 0; i < this.mpListGroup.length; i++) {
            let groupLinks = [];
            rankingAndGroup.push([]);
            for (let j = 0; j < this.mpListGroup[i].list.length; j++) {
                let r = ranking[i].findIndex((x) => x == j);
                rankingAndGroup[i].push({rank: r, group: -1});
            }
            // rankingAndGroup[i].sort((a, b) => {
            //     return this.getPoint(i, a.rank).y - this.getPoint(i, b.rank).y;
            // });
            for (let j = 0; j < this.mpListGroup[i].list.length; j++) {
                rankingAndGroup[i][j].group = this.mpListGroup[i].list[j].link;
                if (this.mpListGroup[i].list[j].link > -1) {
                    groupLinks.push(this.mpListGroup[i].list[j].link);
                }
            }
            groupLinks = Array.from(new Set(groupLinks));
            groupLinks.sort((a, b) => {
                return a - b;
            });
            for (let j = 0; j < this.mpListGroup[i].list.length; j++) {
                if (rankingAndGroup[i][j].group === -1) {
                    rankingAndGroup[i][j].group = "";
                } else {
                    let index = groupLinks.findIndex((x) => x == rankingAndGroup[i][j].group);
                    if (index < alphabet.length) {
                        if (this.mpListGroup[i].list[j].type === 'esc') {
                            rankingAndGroup[i][j].group = alphabet.charAt(index) + "'";
                        } else {
                            rankingAndGroup[i][j].group = alphabet.charAt(index);
                        }
                    } else {
                        if (this.mpListGroup[i].list[j].type === 'esc') {
                            rankingAndGroup[i][j].group = "XX'";
                        } else {
                            rankingAndGroup[i][j].group = "XX";
                        }
                    }
                }
            }
        }
        return rankingAndGroup;
    }

    
}