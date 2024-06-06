module.exports = {
  friendlyName: "Create doctor",

  description: "Create a new doctor",

  inputs: {
    id: {
      type: 'number',
      description: 'The ID of the doctor (optional)',
    },
    name: {
      type: 'string',
      required: true,
      description: 'The name of the doctor',
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true,
      unique: true,
      description: 'The email of the doctor',
    },
    password: {
      type: 'string',
      required: true,
      description: 'The password of the doctor',
    },
  },

  exits: {
    success: {
      description: 'New doctor created successfully',
    },
    invalid: {
      description: 'The provided parameters are invalid',
    },
    serverError: {
      description: 'An unexpected error occurred',
    }
  },

  fn: async function (inputs, exits) {
    try {
      const doctor = await Doctor.create({
        id: inputs.id,
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      }).fetch();

      return exits.success(doctor);
    } catch (err) {
      if (err.code === 'E_UNIQUE') {
        return exits.invalid({
          error: 'Email already in use',
        });
      }
      return exits.serverError({
        error: err.message,
      });
    }
  },
};
