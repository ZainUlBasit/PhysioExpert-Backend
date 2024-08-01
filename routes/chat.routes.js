const { VerifyUserCookie, VerifyAdmin } = require("../Middleware/auth");
const ChatController = require("../controllers/ChatController");

const router = require("express").Router();

router.post("/send-message", ChatController.sendMessage);

module.exports = router;
