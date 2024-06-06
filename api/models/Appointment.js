// api/models/Appointment.js

module.exports = {
  attributes: {
    id: {
      type: 'number',
      autoIncrement: true,
      unique: true,
    },
    doctorId: {
      model: 'doctor',
      required: true,
    },
    patientName: {
      type: 'string',
      required: true,
      maxLength: 120,
    },
    patientEmail: {
      type: 'string',
      required: true,
      isEmail: true,
    },
    appointmentDate: {
      type: 'string',
      required: true,
      description: 'The date of the appointment, in YYYY-MM-DD format',
    },
    slotStartTime: {
      type: 'string',
      required: true,
      description: 'The start time of the appointment slot, in HH:mm format',
    },
    slotEndTime: {
      type: 'string',
      required: true,
      description: 'The end time of the appointment slot, in HH:mm format',
    },
  },
};
