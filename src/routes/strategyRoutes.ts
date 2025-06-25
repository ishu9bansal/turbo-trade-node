import express from 'express';
const { createBacktest,getUserBacktests } = require("../controllers/strategyController");

const router = express.Router();

// POST /api/users/verify
router.post('/create', createBacktest);

router.get('/user', getUserBacktests);

export default router;
