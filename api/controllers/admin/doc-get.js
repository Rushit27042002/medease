module.exports = {
  friendlyName: "Doc get",

  description: "Fetch all doctors or search by partial name/email",

  inputs: {
    keyword: {
      type: "string",
      description: "Partial name or email to search for",
      required: false,
    },
    page: {
      type: "number",
      description: "Page number for pagination",
      required: false,
    },
    limit: {
      type: "number",
      description: "Number of records per page",
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
    // const tokenData = this.req.headers.authorization;
    // const bData = this.req.user;
    // console.log(bData);
    // console.log(tokenData);

    try {
      const keyword = inputs.keyword;
      const page = parseInt(this.req.params.page) || 1; // Parse page number from request params
      const limit = inputs.limit || 5; // Default limit is set to 5 if not provided
      const skip = (page - 1) * limit;

      let query = {};

      if (keyword) {
        query = {
          where: {
            or: [
              { name: { contains: keyword } },
              { email: { contains: keyword } },
            ],
          },
        };
      }

      // Get total count for pagination
      const totalCount = await Doctor.count(query.where || {});

      // Fetch doctors with pagination
      const doctors = await Doctor.find({
        where: query.where,
        limit: limit,
        skip: skip,
      });

      // Prepare pagination metadata optional
      const pagination = {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        pageSize: limit,
      };

      return exits.success({
        success: true,
        data: doctors,
        // pagination: pagination,
      });
    } catch (err) {
      return exits.serverError({
        success: false,
        message: err.message,
      });
    }
  },
};
