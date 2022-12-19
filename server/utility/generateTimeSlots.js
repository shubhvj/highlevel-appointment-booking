const moment = require("moment-timezone");
const constants = require('../utility/constant');
var startTime = moment().utc().set({ hour: constants.startTime, minute: 00 });
var endTime = moment().utc().set({ hour: constants.endTime, minute: 30 });

var timeSlots = [];

const generateTimeSlots = (startDate, timezone) => {
   
    while (startTime <= endTime) {
        
        timeSlots.push(moment(startTime).format('HH:mm'));
        startTime.add(30, 'minutes');
    }
    
    return timeSlots;
}

module.exports = {
    generateTimeSlots
}