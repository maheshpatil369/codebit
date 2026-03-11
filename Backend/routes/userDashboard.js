import { Router } from "express";

import { getUserDashboard } from "../controllers/userDashboardController.js";

const router = Router();

router.get("/dashboard", getUserDashboard);

export default router;
