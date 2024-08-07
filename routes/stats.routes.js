const StatController = require("../controllers/StatsController");

const router = require("express").Router();

// router.post("/logout", VerifyUserCookie, authControllers().logout);
router.get("/get", StatController.getAdminStats);
// router.post("/register", authControllers().register);
// router.post("/verify-otp", authControllers().verifyOtp);

// router.get("/refresh", VerifyUserCookie, authControllers().autoLogin);
// router.get("/branch", authControllers().branches);
// router.delete("/branch/:id", authControllers().deleteBranch);
// router.patch("/branch", authControllers().updateBranch);

module.exports = router;
