import { Router } from 'express';
const { createStrategy, getUserStrategies, updateStrategy } = require("../controllers/strategyController");
const router = Router();


router.get('/', getUserStrategies);
router.post('/', createStrategy);
router.put('/:id', updateStrategy);

export default router;
