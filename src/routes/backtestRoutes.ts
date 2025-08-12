const router = require("express").Router();
const { createBacktest,getUserBacktests } = require("../controllers/backtestController");
const { authMiddleware } = require("../middleware/authMiddleware");

// POST /api/users/verify
router.post('/create', authMiddleware, createBacktest);

router.get('/user', authMiddleware, getUserBacktests);

export default router;
