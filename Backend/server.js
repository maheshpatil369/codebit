import express from "express";
import cors from "cors";

import userDashboardRoutes from "./routes/userDashboard.js";
import companyDashboardRoutes from "./routes/companyDashboard.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "LexNova Dashboard API",
    version: "2.0.0",
    status: "running",
    message: "Backend server is running successfully",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "dashboard-api",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/user", userDashboardRoutes);
app.use("/api/company", companyDashboardRoutes);
app.use("/api/v1/enterprise/company", companyDashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
