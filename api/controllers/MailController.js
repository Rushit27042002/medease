const nodemailer = require("nodemailer");

module.exports = {
  sendEmail: async function (req, res) {
    try {
      const { name, email, subject, message } = req.body;

      // Validation
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required!" });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const validSubjects = [
        "General Inquiry", 
        "Appointment Help",
        "Technical Support",
        "Feedback",
        "Partnership"
      ];
      
      if (!validSubjects.includes(subject)) {
        return res.status(400).json({ message: "Invalid subject" });
      }

      // Email transport
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: sails.config.custom.email,
          pass: sails.config.custom.emailPassword,
        },
      });

      // Email content
      const mailOptions = {
        from: `${name} <${sails.config.custom.email}>`,
        to: "rushitsuthar70917@gmail.com",
        replyTo: email,
        subject: `[MedEase Contact] ${subject} - From ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      };

      // Send email
      await transporter.sendMail(mailOptions);
      
      sails.log.info(`Contact form submitted by ${email}`);
      return res.json({ message: "Thank you! Your message has been sent." });

    } catch (error) {
      sails.log.error('Email sending failed:', error);
      return res.status(500).json({ 
        message: "An error occurred while sending your message. Please try again later." 
      });
    }
  },
};