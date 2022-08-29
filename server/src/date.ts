
class MyDate {
    year: number;
    month: number;
    day: number;

    constructor(year: number, month: number, day: number) {
        this.year = year;
        this.month = month;
        this.day = day;
    }


    toString() {
        const month = this.month < 10 ? `0${this.month}` : this.month;
        const day = this.day < 10 ? `0${this.day}` : this.day;
        return `${this.year}-${this.month}-${this.day}`;
    }

    // convert Date to string in formt yyyy-mm-dd
    static DateToString(d: Date): string {
        const year = d.getFullYear();
        const month = d.getMonth() < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
        const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();

        return `${year}-${month}-${day}`
    }
}

export default MyDate;