
import Time from './time'
const stratDayWork = { h: 8, m: 0 };
const endDayWork = { h: 22, m: 0 };

const timeRange: Time[] = [];
for (let i = stratDayWork.h; i < endDayWork.h; i++) {
    timeRange.push(new Time(i, 0));
    timeRange.push(new Time(i, 30));
}

exports.timeRange = timeRange;
