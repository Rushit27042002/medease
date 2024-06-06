// api/controllers/AuthController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = "admin@email.com";
const ADMIN_PASSWORD = "admin"; // Plain text password for admin
const JWT_SECRET = "123456789"; // Secret key for JWT

module.exports = {
  login: async function (req, res) {
    try {
      // Extract email and password from request body
      const { email, password } = req.body;

      // Check if the login is for admin
      if (email === ADMIN_EMAIL) {
        if (password !== ADMIN_PASSWORD) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token for admin
        const payload = {
          role: "admin",
          email: ADMIN_EMAIL,
        };
        const adminToken = jwt.sign(payload, JWT_SECRET);

        // Respond with success message and JWT token
        return res.json({
          message: "Admin login successful",
          token: adminToken,
        });
      }

      // Find doctor by email in the database
      const doctor = await Doctor.findOne({ email });

      // If doctor not found, return error
      if (!doctor) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Check if the password matches
      const passwordMatch = await bcrypt.compare(password, doctor.password);

      // If password doesn't match, return error
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate JWT token with doctor data as payload
      const payload = {
        doctorId: doctor.id,
        email: doctor.email,
        role: "doctor",
      };
      const doctorToken = jwt.sign(payload, JWT_SECRET);

      // Respond with success message and JWT token
      return res.json({
        message: `${doctor.name} Login successful`,
        token: doctorToken,
      });
    } catch (error) {
      // Handle errors
      console.error("Error logging in:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
