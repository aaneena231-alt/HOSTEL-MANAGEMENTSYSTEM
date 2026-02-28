const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = 5000;

let data = {
  users: [],
  expenses: [],
  complaints: [],
  votes: [],
  announcements: []
};

// Load previous data (NO DATA LOSS)
if (fs.existsSync("data.json")) {
  data = JSON.parse(fs.readFileSync("data.json"));
}

// Save data function
function saveData() {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  res.send("Hostel Management Backend is Running 🚀");
});

// REGISTER
app.post("/api/register", (req, res) => {
  const { username, password, role } = req.body;
  data.users.push({ username, password, role });
  saveData();
  res.json({ message: "Registered successfully" });
});

// LOGIN
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = data.users.find(
    u => u.username === username && u.password === password
  );

  if (!user) return res.status(401).json({ message: "Invalid" });

  res.json({ role: user.role });
});

// ADD EXPENSE
app.post("/api/expense", (req, res) => {
  data.expenses.push(req.body);
  saveData();
  res.json({ message: "Expense added" });
});

// GET EXPENSE
app.get("/api/expense/:username", (req, res) => {
  const userExpenses = data.expenses.filter(
    e => e.username === req.params.username
  );
  res.json(userExpenses);
});

// ADD COMPLAINT
app.post("/api/complaint", (req, res) => {
  data.complaints.push(req.body);
  saveData();
  res.json({ message: "Complaint sent" });
});

// GET COMPLAINT
app.get("/api/complaint", (req, res) => {
  res.json(data.complaints);
});

// ADD VOTE
app.post("/api/vote", (req, res) => {
  const { title } = req.body;
  const existing = data.votes.find(v => v.title === title);
  if (existing) existing.count++;
  else data.votes.push({ title, count: 1 });
  saveData();
  res.json({ message: "Voted" });
});

// GET VOTES
app.get("/api/vote", (req, res) => {
  res.json(data.votes);
});

// ANNOUNCEMENT
app.post("/api/announcement", (req, res) => {
  data.announcements.push(req.body);
  saveData();
  res.json({ message: "Announcement posted" });
});

app.get("/api/announcement", (req, res) => {
  res.json(data.announcements);
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
