class MyDate {
    year: number;
    month: number;
    day: number;

    constructor(y: number, m: number, d: number) {
        this.year = y;
        this.month = m;
        this.day = d;
    }

    static toString(date: MyDate): string {
        const m = date.month < 10 ? `0${date.month}` : date.month;
        const d = date.day < 10 ? `0${date.day}` : date.day;
        return `${date.year}-${m}-${d}`
    }

    static dateToString(d: Date): string {
        return this.toString(new MyDate(d.getFullYear(), d.getMonth() + 1, d.getDate()));
    }

    // get first day date in same week like d 
    static getFirstDayOfTheWeek(d: Date | string) {
        const date = new Date(d);
        const result = new Date(date.setDate(date.getDate() - date.getDay()));
        return this.dateToString(result);
    }
}


export default MyDate;