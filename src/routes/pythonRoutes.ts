// src/routes/pythonProxyRoutes.ts
const router = require("express").Router();
const { getConfig,getContracts } = require("../controllers/pythonController")

router.get('/contracts', getContracts);
router.get('/config', getConfig);

export default router;
