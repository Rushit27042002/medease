module.exports = {
  friendlyName: "Doc get",

  description: "Fetch all doctors or search by partial name/email",

  inputs: {
    keyword: {
      type: "string",
      description: "Partial name or email to search for",
      required: false,
    },
  },

  exits: {
    success: {
      description: "Successfully fetched doctors",
    },
    serverError: {
      description: "Server error",
    },
  },

  fn: async function (inputs, exits) {
    const tokenData = this.req.headers.authorization;
    const bData = this.req.user
    console.log(bData);
    console.log(tokenData);
    try {
      const keyword = inputs.keyword;
      let doctors;

      if (keyword) {
        // Search for doctors by partial name or email
        doctors = await Doctor.find({
          where: {
            or: [
              { name: { contains: keyword } },
              { email: { contains: keyword } },
            ],
          },
        });
      } else {
        // Get all doctors
        doctors = await Doctor.find();
      }

      return exits.success(doctors);
    } catch (err) {
      return exits.serverError({
        success: false,
        message: err.message,
      });
    }
  },
};
