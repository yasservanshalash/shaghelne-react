"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = __importDefault(require("../controllers/categoryController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes - no auth needed
router.get('/', categoryController_1.default.getAll);
router.get('/search', categoryController_1.default.search);
router.get('/:id', categoryController_1.default.getById);
router.get('/:id/subcategories', categoryController_1.default.getSubcategories);
// Admin routes - require auth and admin role
router.post('/', auth_1.verifyToken, auth_1.authorizeAdmin, categoryController_1.default.create);
router.put('/:id', auth_1.verifyToken, auth_1.authorizeAdmin, categoryController_1.default.update);
router.delete('/:id', auth_1.verifyToken, auth_1.authorizeAdmin, categoryController_1.default.delete);
exports.default = router;
