const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "./data.json";

// Read data
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Save data
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Login API
app.post("/login", (req, res) => {
  const { id, role } = req.body;
  const data = readData();

  if (role === "admin" && id === data.admin.id)
    return res.json({ success: true });

  if (role === "security" && id === data.security.id)
    return res.json({ success: true });

  const member = data.members.find(m => m.id === id);
  if (member) return res.json({ success: true });

  res.json({ success: false });
});

// Admin data
app.get("/admin/data", (req, res) => {
  res.json(readData());
});

// Security entry
app.post("/entry", (req, res) => {
  const data = readData();
  data.entries.push(req.body);
  saveData(data);
  res.json({ success: true });
});

// IMPORTANT for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Pearl Enclave Backend running");
});
