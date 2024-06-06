// api/policies/isDoctor.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = "123456789"; // Secret key for JWT

module.exports = async function (req, res, proceed) {
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if the user is a doctor
    if (decoded.role === "doctor") {
      // Proceed to the next policy or controller
      req.user = decoded;
      return proceed();
    }
    
    // If not a doctor, return forbidden response
    return res.forbidden({
      error: "You are not authorized to perform this action.",
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Unauthorized access" });
  }
};
