// api/controllers/doctor-dash/appointments-get.js

module.exports = {
    friendlyName: 'Get Slots by Doctor ID',
  
    description: 'Get slots for a specific doctor by doctor ID from the payload.',
  
    exits: {
      success: {
        description: 'Slots found successfully.',
      },
      doctorNotFound: {
        statusCode: 404,
        description: 'Doctor not found.',
      },
      serverError: {
        responseType: 'serverError',
        description: 'Something went wrong on the server.',
      },
    },
  
    fn: async function (_, exits) {
      try {
        // Access doctorId from the payload
        const doctorId = this.req.user.doctorId;
  
        // Check if the doctor exists
        const doctor = await Doctor.findOne({ id: doctorId });
        if (!doctor) {
          return exits.doctorNotFound({ error: 'Doctor not found.' });
        }
  
        // Find slots for the specific doctor
        const slots = await Appointment.find({ doctorId });
  
        return exits.success(slots);
      } catch (err) {
        return exits.serverError(err);
      }
    },
  };
  