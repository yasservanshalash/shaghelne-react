"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = __importDefault(require("../services/authService"));
const notificationService_1 = __importDefault(require("../services/notificationService"));
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                // Validate input
                if (!body.email || !body.password || !body.name) {
                    return res.status(400).json({ message: 'Email, password, and name are required' });
                }
                const { user, token } = yield authService_1.default.register(body);
                // Create welcome notification
                try {
                    yield notificationService_1.default.create({
                        userId: user.id,
                        title: 'Welcome to Shaghelne!',
                        message: 'Thank you for joining our platform.',
                        type: 'SYSTEM'
                    });
                }
                catch (error) {
                    // Continue even if notification creation fails
                    console.error('Failed to create welcome notification:', error);
                }
                return res.status(201).json({ user, token });
            }
            catch (error) {
                console.error('Registration error:', error);
                if (error.message === 'Email already registered') {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                // Validate input
                if (!body.email || !body.password) {
                    return res.status(400).json({ message: 'Email and password are required' });
                }
                const { user, token } = yield authService_1.default.login(body);
                return res.status(200).json({ user, token });
            }
            catch (error) {
                console.error('Login error:', error);
                if (error.message === 'Invalid credentials') {
                    return res.status(401).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // JWT tokens are stateless, so we don't need to invalidate them on the server
            // The client should remove the token from storage
            return res.status(200).json({ message: 'Logged out successfully' });
        });
    }
    static updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const updatedProfile = yield authService_1.default.updateProfile(userId, req.body);
                return res.status(200).json(updatedProfile);
            }
            catch (error) {
                console.error('Update profile error:', error);
                if (error.message === 'User not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const body = req.body;
                // Validate input
                if (!body.oldPassword || !body.newPassword) {
                    return res.status(400).json({ message: 'Old password and new password are required' });
                }
                const result = yield authService_1.default.changePassword(userId, body.oldPassword, body.newPassword);
                return res.status(200).json(result);
            }
            catch (error) {
                console.error('Change password error:', error);
                if (error.message === 'User not found' || error.message === 'Current password is incorrect') {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                // Validate input
                if (!body.email) {
                    return res.status(400).json({ message: 'Email is required' });
                }
                // In a real implementation, you would:
                // 1. Generate a reset token and save it to the user record
                // 2. Send an email with a link containing the token
                return res.status(200).json({
                    message: 'If an account with that email exists, a password reset link has been sent'
                });
            }
            catch (error) {
                console.error('Forgot password error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                // Validate input
                if (!body.token || !body.newPassword) {
                    return res.status(400).json({ message: 'Token and new password are required' });
                }
                const result = yield authService_1.default.resetPassword(body.token, body.newPassword);
                return res.status(200).json(result);
            }
            catch (error) {
                console.error('Reset password error:', error);
                if (error.message === 'Invalid or expired token' || error.message === 'User not found') {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // In a real implementation, you would:
                // 1. Validate the verification token
                // 2. Update the user's email verification status
                return res.status(200).json({ message: 'Email verified successfully' });
            }
            catch (error) {
                console.error('Email verification error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
}
exports.default = AuthController;
