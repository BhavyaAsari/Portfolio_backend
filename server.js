import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
const router = express.Router();

// Middleware
app.use(cors({
  origin: "*",          
  methods: "POST"
}));
app.use(express.json());
app.use("/", router);

// Nodemailer Transporter
const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify Mail Server Connection
contactEmail.verify((error) => {
  if (error) {
    console.log("Mail Server Error:", error);
  } else {
    console.log("Mail Server Ready");
  }
});

// Contact Route
router.post("/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    const name = `${firstName} ${lastName}`;

    const mail = {
      from: name,
      to: process.env.MAIL_USER,
      subject: "Portfolio Contact Form Submission",
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    };

    await contactEmail.sendMail(mail);
    return res.json({ success: true, message: "Message sent successfully" });

  } catch (err) {
    console.error("Email Error:", err);
    return res.json({ success: false, message: "Email not sent" });
  }
});

// Start Server
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log("Server running on port", PORT));
