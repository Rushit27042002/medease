module.exports = {
  friendlyName: "Update doctor",

  description: "Update a doctor by ID",

  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'The ID of the doctor to update',
    },
    name: {
      type: 'string',
      required: false,
      description: 'The name of the doctor',
    },
    email: {
      type: 'string',
      required: false,
      isEmail: true,
      description: 'The email of the doctor',
    },
    password: {
      type: 'string',
      required: false,
      description: 'The password of the doctor',
    }
  },

  exits: {
    success: {
      description: 'Doctor was successfully updated',
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
      const updatedDoctor = await Doctor.updateOne({ id: inputs.id }).set({
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });

      if (!updatedDoctor) {
        return exits.notFound({ error: "Doctor not found" });
      }

      return exits.success(updatedDoctor);
    } catch (err) {
      return exits.serverError({ error: err.message });
    }
  },
};
