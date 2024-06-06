const moment = require("moment");

module.exports = {
  generateSlots: async function (startTime, endTime, duration, breakTime, date) {
    const slots = [];
    let currentTime = moment(`${date} ${startTime}`, "YYYY-MM-DD HH:mm");
    const endTimeMoment = moment(`${date} ${endTime}`, "YYYY-MM-DD HH:mm");

    // Fetch booked slots for the specified date
    const bookedSlots = await Appointment.find({
      where: { appointmentDate: date },
      select: ["slotStartTime", "slotEndTime", "doctorId"]
    });

    // Convert bookedSlots to a set for faster lookup
    const bookedSlotSet = new Set(
      bookedSlots.map(slot => `${slot.slotStartTime}-${slot.slotEndTime}-${slot.doctorId}`)
    );

    while (currentTime.isBefore(endTimeMoment)) {
      const slotStart = currentTime.clone();
      const slotEnd = moment.min(
        currentTime.clone().add(duration, "minutes"),
        endTimeMoment
      );

      // Check if the current slot is booked for any doctor
      const slotIdentifier = `${slotStart.format("HH:mm")}-${slotEnd.format("HH:mm")}`;

      slots.push({
        startTime: slotStart.format("HH:mm"),
        endTime: slotEnd.format("HH:mm"),
        slotIdentifier
      });

      currentTime.add(duration + breakTime, "minutes");
    }

    return { slots, bookedSlotSet };
  },
};
