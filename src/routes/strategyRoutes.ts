import express from 'express';
const { createStrategy } = require("../controllers/strategyController");

const router = express.Router();

// POST /api/users/verify
router.post('/add-strategy', createStrategy);

export default router;
