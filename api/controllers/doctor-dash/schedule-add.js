// api/controllers/doctor-dash/schedule-add.js

const moment = require('moment');

module.exports = {
  friendlyName: 'Create Schedule',

  description: 'Create or update a schedule for a doctor.',

  inputs: {
    monday: {
      type: 'json',
    },
    tuesday: {
      type: 'json',
    },
    wednesday: {
      type: 'json',
    },
    thursday: {
      type: 'json',
    },
    friday: {
      type: 'json',
    },
    saturday: {
      type: 'json',
    },
    slotDuration: {
      type: 'number',
      required: true,
    },
    breakDuration: {
      type: 'number',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Schedule added successfully.',
    },
    invalid: {
      responseType: 'badRequest',
      description: 'The provided data is invalid.',
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

  fn: async function (inputs, exits) {
    try {
      const doctorId = this.req.user.doctorId; // Access doctorId from the payload

      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

      // Validate and parse the start and end times
      for (const day of days) {
        if (inputs[day]) {
          const { start, end } = inputs[day];

          // Validate the time format
          if (!moment(start, 'HH:mm', true).isValid() || !moment(end, 'HH:mm', true).isValid()) {
            return exits.invalid({ error: `Invalid time format for ${day}.` });
          }
        }
      }

      // Check for existing schedule and update if found
      const existingSchedule = await schedule.findOne({ doctorId });

      if (existingSchedule) {
        // Update the existing schedule
        const updatedSchedule = await schedule.updateOne({ id: existingSchedule.id }).set({
          monday: inputs.monday,
          tuesday: inputs.tuesday,
          wednesday: inputs.wednesday,
          thursday: inputs.thursday,
          friday: inputs.friday,
          saturday: inputs.saturday,
          slotDuration: inputs.slotDuration,
          breakDuration: inputs.breakDuration,
        });

        return exits.success(updatedSchedule);
      } else {
        // Create a new schedule
        const newSchedule = await schedule.create({
          doctorId,
          monday: inputs.monday,
          tuesday: inputs.tuesday,
          wednesday: inputs.wednesday,
          thursday: inputs.thursday,
          friday: inputs.friday,
          saturday: inputs.saturday,
          slotDuration: inputs.slotDuration,
          breakDuration: inputs.breakDuration,
        }).fetch();

        return exits.success(newSchedule);
      }
    } catch (err) {
      return exits.serverError(err);
    }
  },
};
