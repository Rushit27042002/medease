module.exports = {
  friendlyName: "Delete doctor",

  description: "Delete a doctor by ID",

  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'The ID of the doctor to delete',
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
      description: 'An unexpected error occurred',
    }
  },

  fn: async function (inputs, exits) {
    try {
      const deletedDoctor = await Doctor.destroyOne({ id: inputs.id });

      if (!deletedDoctor) {
        return exits.notFound({ error: "Doctor not found" });
      }

      return exits.success({ message: "Doctor deleted successfully" });
    } catch (err) {
      return exits.serverError({ error: err.message });
    }
  },
};
