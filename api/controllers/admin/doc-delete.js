module.exports = {
  friendlyName: "Delete doctor",

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Doctor deleted successfully',
    },
    notFound: {
      description: 'No doctor found with the specified ID',
    },
    serverError: {
      description: 'Unexpected error occurred',
    },
  },

  fn: async function (inputs, exits) {
    try {
      // Delete all child's first
      await schedule.destroy({ doctorId: inputs.id }).fetch();
      await Appointment.destroy({ doctorId: inputs.id }).fetch();

      // Now delete Doctor
      const deletedDoctor = await Doctor.destroyOne({ id: inputs.id });

      if (!deletedDoctor) {
        return exits.notFound({ error: "Doctor not found" });
      }

      return exits.success({ message: "Doctor & related data deleted successfully" });

    } catch (err) {
      return exits.serverError({ error: err.message });
    }
  },
};
