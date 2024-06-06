// api/controllers/user/slot-book.js

module.exports = {
  friendlyName: 'Book Appointment',

  description: 'Book an appointment for a given slot and doctor.',

  inputs: {
    doctorId: {
      type: 'number',
      required: true,
      description: 'The ID of the doctor for whom the appointment is being booked.',
    },
    patientName: {
      type: 'string',
      required: true,
      description: 'The name of the patient booking the appointment.',
    },
    patientEmail: {
      type: 'string',
      required: true,
      isEmail: true,
      description: 'The email of the patient booking the appointment.',
    },
    appointmentDate: {
      type: 'string',
      required: true,
      description: 'The date of the appointment being booked. Format: YYYY-MM-DD',
    },
    slotStartTime: {
      type: 'string',
      required: true,
      description: 'The start time of the appointment slot being booked. Format: HH:mm',
    },
    slotEndTime: {
      type: 'string',
      required: true,
      description: 'The end time of the appointment slot being booked. Format: HH:mm',
    },
  },

  exits: {
    success: {
      description: 'Appointment booked successfully.',
    },
    invalidInput: {
      responseType: 'badRequest',
      description: 'Invalid input data.',
    },
    doctorNotFound: {
      statusCode: 404,
      description: 'Doctor not found.',
    },
    slotUnavailable: {
      statusCode: 409,
      description: 'The requested slot is already booked.',
    },
    serverError: {
      responseType: 'serverError',
      description: 'Something went wrong on the server.',
    },
  },

  fn: async function ({ doctorId, patientName, patientEmail, appointmentDate, slotStartTime, slotEndTime }, exits) {
    try {
      // Check if the doctor exists
      const doctor = await Doctor.findOne({ id: doctorId });
      if (!doctor) {
        return exits.doctorNotFound({ error: 'Doctor not found.' });
      }

      // Check if the slot is available
      const existingAppointment = await Appointment.findOne({
        doctorId,
        appointmentDate,
        slotStartTime,
        slotEndTime,
      });
      if (existingAppointment) {
        return exits.slotUnavailable({ error: 'The requested slot is already booked.' });
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
