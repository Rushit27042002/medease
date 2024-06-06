// api/policies/isAdmin.js

const jwt = require('jsonwebtoken'); // Ensure the jwt package is imported

module.exports = async function (req, res, proceed) {
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, '123456789');
    
    // Check if the user is an admin
    if (decoded.role === 'admin') {
      // Attach the decoded payload to req.user
      req.user = decoded;
      // Proceed to the next policy or controller
      return proceed();
    }

    // If not admin, return forbidden response
    return res.forbidden({ error: 'You are not authorized to perform this action.' });
  } catch (error) {
    // Log the error for debugging
    console.error("Error verifying admin token:", error);
    // Return unauthorized response
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
