// api/controllers/doctor-dash/schedule-get.js

module.exports = {
  friendlyName: 'Find Schedule by Doctor ID',

  description: 'Find a schedule by Doctor ID.',

  exits: {
    success: {
      description: 'Schedule found successfully.',
    },
    notFound: {
      responseType: 'notFound',
      description: 'No schedule found for the specified Doctor ID.',
    },
    serverError: {
      responseType: 'serverError',
      description: 'Something went wrong on the server.',
    },
  },

  fn: async function (inputs, exits) {
    try {
      const doctorId = this.req.user.doctorId; // Access doctorId from the payload

      const Schedule = await schedule.findOne({ doctorId });

      if (!Schedule) {
        return exits.notFound({ error: 'No schedule found for the specified Doctor ID.' });
      }

      return exits.success(Schedule);
    } catch (err) {
      return exits.serverError(err);
    }
  },
};
