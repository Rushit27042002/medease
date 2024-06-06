// api/services/SlotService.js

const moment = require("moment");

module.exports = {
  generateSlots: function (startTime, endTime, duration, breakTime, date) {
    const slots = [];
    let currentTime = moment(`${date} ${startTime}`, "YYYY-MM-DD HH:mm");
    const endTimeMoment = moment(`${date} ${endTime}`, "YYYY-MM-DD HH:mm");

    while (currentTime.isBefore(endTimeMoment)) {
      const slotStart = currentTime.clone();
      const slotEnd = moment.min(
        currentTime.clone().add(duration, "minutes"),
        endTimeMoment
      );
      slots.push({
        startTime: slotStart.format("HH:mm"),
        endTime: slotEnd.format("HH:mm"),
      });
      currentTime.add(duration + breakTime, "minutes");
    }

    return slots;
  },
};
