const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Backend server is running successfully 🚀"
  });
});

// Test API route
app.get("/api/test", (req, res) => {
  res.json({
    status: "success",
    data: "API is working properly"
  });
});

// POST test
app.post("/api/data", (req, res) => {
  const data = req.body;

  res.json({
    message: "Data received",
    yourData: data
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});