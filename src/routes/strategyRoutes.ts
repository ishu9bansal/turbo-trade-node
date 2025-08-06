const router = require("express").Router();
const { createStrategy, getUserStrategies, updateStrategy } = require("../controllers/strategyController");
const { authMiddleware } = require("../middleware/authMiddleware");


router.get('/', authMiddleware, getUserStrategies);
router.post('/', authMiddleware, createStrategy);
router.put('/:id', authMiddleware, updateStrategy);

export default router;
