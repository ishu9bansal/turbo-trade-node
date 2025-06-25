// src/routes/pythonProxyRoutes.ts
import express from 'express';
const { getConfig,getContracts } = require("../controllers/pythonController")

const router = express.Router();

router.get('/contracts', getContracts);
router.get('/config', getConfig);

export default router;
