// api/controllers/doctor-dash/schedule-remove.js

module.exports = {
  friendlyName: 'Remove Schedule by Doctor ID',

  description: 'Remove a schedule by Doctor ID.',

  exits: {
    success: {
      description: 'Schedule removed successfully.',
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

      await schedule.destroyOne({ doctorId });

      return exits.success({ message: 'Schedule removed successfully.' });
    } catch (err) {
      return exits.serverError(err);
    }
  },
};
