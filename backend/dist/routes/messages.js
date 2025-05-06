"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = __importDefault(require("../controllers/messageController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All message routes require authentication
router.use(auth_1.verifyToken);
// Get all messages for the current user
router.get('/', messageController_1.default.getAll);
// Get all conversations for the current user
router.get('/conversations', messageController_1.default.getConversations);
// Get a specific conversation with another user
router.get('/conversation/:userId', messageController_1.default.getConversation);
// Send a new message
router.post('/', messageController_1.default.create);
// Get a specific message by ID
router.get('/:id', messageController_1.default.getById);
// Mark a message as read
router.put('/:id/read', messageController_1.default.markAsRead);
// Delete a message
router.delete('/:id', messageController_1.default.delete);
exports.default = router;
