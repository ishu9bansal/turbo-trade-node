import { Router } from 'express';
const { createStrategy, getUserStrategies, updateStrategy } = require("../controllers/strategyController");
const router = Router();


router.get('/get-strategy', getUserStrategies);
router.post('/add-strategy', createStrategy);
router.put('/update-strategy/:id', updateStrategy);

export default router;
