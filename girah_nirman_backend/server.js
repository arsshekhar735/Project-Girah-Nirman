// Load environment variables from .env file
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET;

const sequelize = new Sequelize("construction_estimator", "root", "2530", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

const Quote = sequelize.define("Quote", {
  name: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  notes: DataTypes.TEXT,
  form: DataTypes.JSON,
  calcResult: DataTypes.JSON,
  status: { 
    type: DataTypes.ENUM("Case Closed", "Pending", "Not Attended"), 
    defaultValue: "Pending" 
  },
  userFeedback: { type: DataTypes.TEXT, allowNull: true },
  
});

const Contact = sequelize.define("Contact", {
  name: DataTypes.STRING,
  phoneOrEmail: DataTypes.STRING,
  message: DataTypes.TEXT,
  status: { 
    type: DataTypes.ENUM("Case Closed", "Pending", "Not Attended"), 
    defaultValue: "Pending" 
  },
  userFeedback: { type: DataTypes.TEXT, allowNull: true },
});

const AdminUser = sequelize.define("AdminUser", {
  name: DataTypes.STRING,
  userid: { type: DataTypes.STRING, unique: true },
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  passwordHash: DataTypes.STRING,
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  userOtp: DataTypes.STRING,
  ownerOtp: DataTypes.STRING,
  otpExpiresAt: DataTypes.DATE,
  otpResendCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  otpResendTime: DataTypes.DATE,
});

const OWNER_EMAIL = "sumanshekharsingh735@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sgensis735@gmail.com",
    pass: "qlwkmbmugltieztz",
  },
});

async function sendEmailOtp(to, type, otp) {
  await transporter.sendMail({
    from: `"Girah Nirman Admin" <your_email@gmail.com>`,
    to,
    subject: `${type} OTP Verification`,
    text: `Your ${type} OTP code is: ${otp}`,
  });
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ success: false, message: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
}

const RATES = {
  materialPerSqft: { economy: 900, standard: 1500, premium: 2200 },
  laborPerSqft: 300,
  supervisionPercent: 6,
  electrical: { basic: 50, standard: 100, smart: 200 },
  plumbing: { standard: 60, premium: 120 },
  falseCeilingPerSqft: 60,
  transportPerKm: 1000,
  gstPercent: 18,
  contingencyPercent: 7,
};

app.get("/api/rates", (req, res) => res.json(RATES));

app.post("/api/calculate", (req, res) => {
  const payload = req.body;
  const r = RATES;
  const areaSqft = Number(payload.area || 0) * (payload.unit === "sqm" ? 10.7639 : 1);
  const materialRate = r.materialPerSqft[payload.materialQuality || "standard"];
  const materialCost = Math.round(materialRate * areaSqft);
  const laborCost = Math.round((payload.laborRate || r.laborPerSqft) * areaSqft);
  const electricalCost = Math.round((r.electrical[payload.electrical] || 0) * areaSqft);
  const plumbingCost = Math.round((r.plumbing[payload.plumbing] || 0) * areaSqft);
  const falseCeilingCost = Math.round(
    r.falseCeilingPerSqft * (payload.falseCeiling ? Number(payload.falseCeilingArea || 0) : 0)
  );
  const extras = electricalCost + plumbingCost + falseCeilingCost;
  const supervisionCost = Math.round(((materialCost + laborCost + extras) * r.supervisionPercent) / 100);
  const transport = payload.transportCharges || r.transportPerKm;
  const subtotal = materialCost + laborCost + extras + supervisionCost + transport;
  const contingency = Math.round((subtotal * r.contingencyPercent) / 100);
  const tax = Math.round(((subtotal + contingency) * r.gstPercent) / 100);
  const total = subtotal + contingency + tax;
  res.json({
    materialCost,
    laborCost,
    extras: { electricalCost, plumbingCost, falseCeilingCost },
    supervisionCost,
    transport,
    contingency,
    tax,
    subtotal,
    total,
  });
});

app.post("/api/request-quote", async (req, res) => {
  try {
    const { lead, form, calcResult } = req.body;
    const newQ = await Quote.create({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      notes: lead.notes,
      form,
      calcResult,
    });
    res.json({ success: true, id: newQ.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// New detail and update routes for Quote
app.get("/api/admin/quote/:id", authenticateAdmin, async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id);
    if (!quote) return res.status(404).json({ success: false, message: "Quote not found" });
    res.json({ success: true, quote });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/api/admin/quote/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { status, userFeedback } = req.body;
    const quote = await Quote.findByPk(req.params.id);
    if (!quote) return res.status(404).json({ success: false, message: "Quote not found" });

    if (status) quote.status = status;
    if (userFeedback !== undefined) quote.userFeedback = userFeedback;
    await quote.save();

    res.json({ success: true, message: "Quote updated", quote });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.post("/api/contact", async (req, res) => {
  try {
    const { name, phoneOrEmail, message } = req.body;
    const newC = await Contact.create({ name, phoneOrEmail, message });
    res.json({ success: true, id: newC.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// New detail and update routes for Contact
app.get("/api/admin/contact/:id", authenticateAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/api/admin/contact/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { status, userFeedback } = req.body;
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });

    if (status) contact.status = status;
    if (userFeedback !== undefined) contact.userFeedback = userFeedback;
    await contact.save();

    res.json({ success: true, message: "Contact updated", contact });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});



app.get("/api/admin/data", authenticateAdmin, async (req, res) => {
  try {
    const quotes = await Quote.findAll({ order: [["createdAt", "DESC"]] });
    const contacts = await Contact.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ quotes, contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch admin data" });
  }
});

app.post("/api/admin/register", async (req, res) => {
  try {
    const { name, userid, phone, email, password } = req.body;
    if (!userid || !phone || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }
    let user = await AdminUser.findOne({ where: { userid } });
    const now = new Date();

    const userOtp = generateOtp();
    const ownerOtp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (user) {
      if (!user.otpResendTime || now - user.otpResendTime > 15 * 60 * 1000) {
        user.otpResendTime = now;
        user.otpResendCount = 0;
      }
      if (user.otpResendCount >= 3) {
        return res.status(429).json({ success: false, message: "OTP resend limit reached. Please wait 15 minutes." });
      }
      user.userOtp = userOtp;
      user.ownerOtp = ownerOtp;
      user.otpExpiresAt = otpExpiresAt;
      user.otpResendCount += 1;
      await user.save();

      await sendEmailOtp(user.email, "User", userOtp);
      await sendEmailOtp(OWNER_EMAIL, `Owner (UserID: ${userid})`, ownerOtp);
      return res.json({ success: true, message: "New OTP sent to your email and owner's email" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await AdminUser.create({
      name,
      userid,
      phone,
      email,
      passwordHash,
      userOtp,
      ownerOtp,
      otpExpiresAt,
      otpResendCount: 1,
      otpResendTime: now,
    });

    await sendEmailOtp(email, "User", userOtp);
    await sendEmailOtp(OWNER_EMAIL, `Owner (UserID: ${userid})`, ownerOtp);
    res.json({ success: true, message: "OTP sent to your email and owner's email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/admin/verify-otp", async (req, res) => {
  try {
    const { userid, userOtp, ownerOtp } = req.body;
    const user = await AdminUser.findOne({ where: { userid } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.isVerified) return res.json({ success: true, message: "Already verified" });
    if (user.otpExpiresAt < new Date()) return res.status(400).json({ success: false, message: "OTP expired" });
    if (user.userOtp !== userOtp || user.ownerOtp !== ownerOtp) return res.status(400).json({ success: false, message: "Invalid OTP(s)" });

    user.isVerified = true;
    user.userOtp = null;
    user.ownerOtp = null;
    user.otpExpiresAt = null;
    user.otpResendCount = 0;
    user.otpResendTime = null;
    await user.save();
    res.json({ success: true, message: "Verified, you can login now" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { userid, password } = req.body;
    const user = await AdminUser.findOne({ where: { userid } });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    if (!user.isVerified) return res.status(403).json({ success: false, message: "Not verified" });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userid: user.userid, name: user.name }, JWT_SECRET, { expiresIn: "2h" });
    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB error:", err);
  });
