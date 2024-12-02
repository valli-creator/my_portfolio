const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/VisitorDetails", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define a Visitor Schema
const visitorSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

// Create a Visitor Model
const Visitor = mongoose.model("Visitor", visitorSchema);

// API Endpoint Example: Fetch all visitors from MongoDB
app.get("/visitors", async (req, res) => {
  try {
    const visitors = await Visitor.find();
    res.json(visitors);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route for contact form submission
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newVisitor = new Visitor({ name, email, message });

  try {
    await newVisitor.save();
    res.status(200).json({
      message: "Form submitted successfully",
      visitor: { name, email, message },
    });
  } catch (err) {
    console.error("Error saving visitor:", err);
    res.status(500).send(err);
  }
});

// Sending skills to frontend React
const skills = {
  Frontend: ["React", "HTML5", "CSS3"],
  Backend: ["Node.js", "Express.js"],
  ProgrammingLanguages: ["Java", "Javascript", "C", "C++"],
  IDE: ["Eclipse", "Visual Studio Code"],
  Framework: "Spring Framework",
  Database: ["MySQL", "MongoDB-NoSQL"],
  VersionControl: "Git/GitHub",
  AutomationTesting: ["Selenium", "JMeter", "Postman", "JUnit", "TestNG"],
  Certified: "AWS Certified Cloud Practitioner",
};

app.get("/api/skills", (req, res) => {
  res.json({ skills });
});

app.get("/", (req, res) => {
  res.send("Hello From Backend");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
