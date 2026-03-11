import { Router } from "express";

import {
  getCompanyActivity,
  getCompanyDashboard,
  getCompanyTeam,
} from "../controllers/companyDashboardController.js";

const router = Router();

router.get("/dashboard", getCompanyDashboard);
router.get("/team", getCompanyTeam);
router.get("/activity", getCompanyActivity);

export default router;
