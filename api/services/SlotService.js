const moment = require("moment");

module.exports = {
  generateSlots: function (startTime, endTime, duration, breakTime, date, transformedSlots) {
    // console.log(transformedSlots);
    const slots = [];
    let currentTime = moment(`${date} ${startTime}`, "YYYY-MM-DD HH:mm");
    const endTimeMoment = moment(`${date} ${endTime}`, "YYYY-MM-DD HH:mm");

    while (currentTime.isBefore(endTimeMoment)) {
      const slotStart = currentTime.clone();
      const slotEnd = moment.min(
        currentTime.clone().add(duration, "minutes"),
        endTimeMoment
      );

      // Compare slotStart and slotEnd with transformed slots and if slots match then continue, else push.
      let isBooked = transformedSlots.some((transformedSlot) => {
        const transformedSlotStart = moment(`${date} ${transformedSlot.startTime}`, "YYYY-MM-DD HH:mm");
        const transformedSlotEnd = moment(`${date} ${transformedSlot.endTime}`, "YYYY-MM-DD HH:mm");
        return slotStart.isSame(transformedSlotStart) && slotEnd.isSame(transformedSlotEnd);
      });

      if (!isBooked) {
        slots.push({
          startTime: slotStart.format("HH:mm"),
          endTime: slotEnd.format("HH:mm"),
        });
      }

      // Move to the next slot regardless of whether the current slot was booked or not
      currentTime.add(duration + breakTime, "minutes");
    }
    return slots;
  },
};
