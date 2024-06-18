// api/controllers/user/slot-book.js

const moment = require("moment");
const SlotService = require("../../services/SlotService");

module.exports = {
  friendlyName: "Book Appointment",

  description: "Book an appointment for a given slot and doctor.",

  inputs: {
    doctorId: {
      type: "number",
      required: true,
      description: "The ID of the doctor for whom the appointment is being booked.",
    },
    patientName: {
      type: "string",
      required: true,
      description: "The name of the patient booking the appointment.",
    },
    patientEmail: {
      type: "string",
      required: true,
      isEmail: true,
      description: "The email of the patient booking the appointment.",
    },
    appointmentDate: {
      type: "string",
      required: true,
      description: "The date of the appointment being booked. Format: YYYY-MM-DD",
    },
    slotStartTime: {
      type: "string",
      required: true,
      description: "The start time of the appointment slot being booked. Format: HH:mm",
    },
  },

  exits: {
    success: {
      description: "Appointment booked successfully.",
    },
    invalidInput: {
      responseType: "badRequest",
      description: "Invalid input data.",
    },
    doctorNotFound: {
      statusCode: 404,
      description: "Doctor not found.",
    },
    slotUnavailable: {
      statusCode: 409,
      description: "The requested slot is already booked.",
    },
    slotInvalid: {
      statusCode: 400,
      description: "The requested slot start time is invalid.",
    },
    serverError: {
      responseType: "serverError",
      description: "Something went wrong on the server.",
    },
  },

  fn: async function (
    { doctorId, patientName, patientEmail, appointmentDate, slotStartTime },
    exits
  ) {
    try {
      // Check if the doctor exists
      const doctor = await Doctor.findOne({ id: doctorId });
      if (!doctor) {
        return exits.doctorNotFound({ error: "Doctor not found." });
      }

      // Get the doctor's schedule to determine the slot duration
      const doctorSchedule = await schedule.findOne({ doctorId });
      if (!doctorSchedule) {
        return exits.invalidInput({ error: "Doctor schedule not found." });
      }

      // Convert the appointment date to a day of the week
      const appointmentDay = moment(appointmentDate, "YYYY-MM-DD").format("dddd").toLowerCase();

      // Check if the doctor has a schedule for the given day
      const daySchedule = doctorSchedule[appointmentDay];
      if (!daySchedule) {
        return exits.invalidInput({ error: `Doctor does not have a schedule for ${appointmentDay}.` });
      }
      const bookedSlots = await Appointment.find({
        where: { doctorId:doctorId, appointmentDate: appointmentDate },
        select: ["slotStartTime", "slotEndTime"]
      });
      
      const transformedSlots = bookedSlots.map(slot => ({
        startTime: slot.slotStartTime,  // Adjusting slotStartTime to endTime
        endTime: slot.slotEndTime
      }));

      // Generate slots for the doctor's schedule on the given day
      const slots = SlotService.generateSlots(
        daySchedule.start,
        daySchedule.end,
        doctorSchedule.slotDuration,
        doctorSchedule.breakDuration,
        appointmentDate,
        transformedSlots
      );

      // Check if the provided slotStartTime is valid
      const slot = slots.find(slot => slot.startTime === slotStartTime);
      if (!slot) {
        return exits.slotInvalid({ error: "The requested slot is not available" });
      }

      // Calculate the slot end time based on the start time and duration
      const slotEndTime = slot.endTime;

      // Check if the slot is available
      const existingAppointment = await Appointment.findOne({
        doctorId,
        appointmentDate,
        slotStartTime,
        slotEndTime,
      });
      if (existingAppointment) {
        return exits.slotUnavailable({
          error: "The requested slot is already booked.",
        });
      }

      // Create the appointment
      const newAppointment = await Appointment.create({
        doctorId,
        patientName,
        patientEmail,
        appointmentDate,
        slotStartTime,
        slotEndTime,
      }).fetch();

      return exits.success(newAppointment);
    } catch (err) {
      return exits.serverError(err);
    }
  },
};
