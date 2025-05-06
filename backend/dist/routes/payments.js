"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = __importDefault(require("../controllers/paymentController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All payment routes require authentication
router.use(auth_1.verifyToken);
// Get all payments for the current user
router.get('/', paymentController_1.default.getAll);
// Get payment history
router.get('/history', paymentController_1.default.getHistory);
// Get earnings data (for freelancers)
router.get('/earnings', paymentController_1.default.getEarnings);
// Process a withdrawal
router.post('/withdraw', paymentController_1.default.withdraw);
// Create a new payment
router.post('/', paymentController_1.default.create);
// Get a specific payment by ID
router.get('/:id', paymentController_1.default.getById);
// Verify a payment
router.put('/:id/verify', paymentController_1.default.verify);
exports.default = router;
