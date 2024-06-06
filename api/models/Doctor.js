const bcrypt = require('bcrypt');

module.exports = {
  attributes: {
    id: {
      type: 'number',
      unique: true,
      autoIncrement: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
    },
    password: {
      type: 'string',
      required: true,
    },
    schedules: {
      collection: 'schedule',
      via: 'doctorId',
    },
    appointments:{
      collection:'appointment',
      via: 'doctorId'
    }
  },

  // Lifecycle callback to hash password before creating a new doctor record
  beforeCreate: async function (valuesToSet, proceed) {
    try {
      // Generate a salt with 10 rounds of processing
      const salt = await bcrypt.genSalt(10);
      // Hash the password with the generated salt
      valuesToSet.password = await bcrypt.hash(valuesToSet.password, salt);
      return proceed();
    } catch (err) {
      return proceed(err);
    }
  },

  // Optional: Lifecycle callback to hash password before updating a doctor record
  beforeUpdate: async function (valuesToSet, proceed) {
    try {
      if (valuesToSet.password) {
        // Generate a salt with 10 rounds of processing
        const salt = await bcrypt.genSalt(10);
        // Hash the new password with the generated salt
        valuesToSet.password = await bcrypt.hash(valuesToSet.password, salt);
      }
      return proceed();
    } catch (err) {
      return proceed(err);
    }
  },
};
