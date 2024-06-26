// api/controllers/user/slots-get.js

const moment = require("moment");
const SlotService = require("../../services/SlotService");
const { select } = require("sails-mysql/helpers");

module.exports = {
  friendlyName: "Find Slots by Date Input",

  description: "Find slots available for a given date input.",

  inputs: {
    date: {
      type: "string",
      required: true,
      description:
        "The date for which slots are to be retrieved. Format: YYYY-MM-DD",
    },
  },

  exits: {
    success: {
      description: "Slots found successfully.",
    },
    invalidDate: {
      responseType: "badRequest",
      description:
        "Invalid date format. Please provide the date in YYYY-MM-DD format.",
    },
    noSchedule: {
      responseType: "notFound",
      description: "No schedules found for any doctor on the specified date.",
    },
    serverError: {
      responseType: "serverError",
      description: "Something went wrong on the server.",
    },
  },

  fn: async function ({ date }, exits) {
    try {

      // Validate the date format using Moment.js
      if (!moment(date, "YYYY-MM-DD", true).isValid()) {
        return exits.invalidDate({
          error:
          "Invalid date format. Please provide the date in YYYY-MM-DD format.",
        });
      }
      // Fetch schedules for all doctors
      const schedules = await schedule.find();

      if (!schedules || schedules.length === 0) {
        return exits.noSchedule({
          error: "No schedules found for any doctor on the specified date.",
        });
      }

      const slots = [];

      // Generate slots for each doctor's schedule
      for (const schedule of schedules) {
        const dayOfWeek = moment(date).format("dddd").toLowerCase();

        // Check if the schedule exists for the specified day
        if (schedule[dayOfWeek]) {
          const { start, end } = schedule[dayOfWeek];
          const { slotDuration, breakDuration } = schedule;
          
          // console.log("New Doc slots===========================")
          const bookedSlots = await Appointment.find({
            where: { doctorId: schedule.doctorId, appointmentDate: date },
            select: ["slotStartTime", "slotEndTime"]
          });
          
          const transformedSlots = bookedSlots.map(slot => ({
            startTime: slot.slotStartTime,  // Adjusting slotStartTime to endTime
            endTime: slot.slotEndTime
          }));
          
          // console.log(transformedSlots);
          // console.log(bookedSlots.startTime)
          // Generate slots using the SlotService
          const doctorSlots = SlotService.generateSlots(
            start,
            end,
            slotDuration,
            breakDuration,
            date,
            transformedSlots
          );

          // Fetch the doctor information
          const doctor = await Doctor.findOne({ id: schedule.doctorId });
          if (doctor) {
            slots.push({
              doctorId: doctor.id,
              doctorName: doctor.name,
              slots: doctorSlots,
            });
          }
        }
      }

      if (slots.length === 0) {
        return exits.noSchedule({
          error: "No schedules found for any doctor on the specified date.",
        });
      }

      return exits.success(slots);
    } catch (err) {
      return exits.serverError(err);
    }
  },
  
};
