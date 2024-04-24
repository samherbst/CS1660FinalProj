function convertToEpoch (date, hour, minute, ampm) {
    date.setHours(hour + (ampm === 'PM' ? 12 : 0));
    date.setMinutes(minute);
    date.setSeconds(0);
    return Math.floor(date.getTime());
}

function convertFromEpoch(epoch) {
    const date = new Date(epoch); // Convert epoch to milliseconds
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert from 24 hour to 12 hour format and adjust for midnight and noon
    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }

    // Add leading zero to minutes if less than 10
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    return {
        hours,
        minutes,
        ampm
    };
}


function main() {
    let hours = 3
    let minutes = 4
    let ampm = "PM"

    let date = new Date()

    let num = convertToEpoch(date, hours, minutes, ampm)
    let obj = convertFromEpoch(num)

    console.log(obj.hours)
    console.log(obj.minutes)
    console.log(obj.ampm)
}

main();