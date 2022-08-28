import G from "glob";

class Time {
    h: number;
    m: number;
    constructor(h: number, m: number) {
        this.h = h % 24;
        this.m = m % 60;
    }

    getTime() {
        const h = this.h < 10 ? `0${this.h}` : this.h;
        const m = this.m < 10 ? `0${this.m}` : this.m;
        return `${h}:${m}`;
    }

    static arrToDict(arr: Time[]) {
        const result: any = {}
        arr.forEach(t => {
            result[t.getTime()] = undefined
        });
        return result;
    }

    static arrToArr(arr: Time[]) {
        const result: string[] = []
        arr.forEach(t => {
            result.push(t.getTime());
        });
        return result;
    }

}

export default Time;