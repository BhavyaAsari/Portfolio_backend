import express from "express";
import cors from "cors";
import { Resend } from "resend";
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

// Resend Client
const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Contact Route
router.post("/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    const name = `${firstName} ${lastName}`;

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", 
      to: process.env.TO_EMAIL,
      subject: "Portfolio Contact Form Submission",
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    return res.json({ success: true, message: "Message sent successfully" });

  } catch (error) {
    console.error("Email Error:", error);
    return res.json({ success: false, message: "Email not sent" });
  }
});

// Start Server
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`server running at ${PORT}`));
