"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importStar(require("../models/User"));
class AuthService {
    static generateToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        });
    }
    static register(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, name, role } = input;
            // Check if user exists
            const existingUser = yield User_1.default.findOne({ email });
            if (existingUser) {
                throw new Error('Email already registered');
            }
            // Hash password
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            // Create user
            const user = yield User_1.default.create({
                email,
                password: hashedPassword,
                name,
                role: role || User_1.Role.USER
            });
            // Generate token
            const token = yield this.generateToken(user.id);
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token
            };
        });
    }
    static login(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = input;
            // Check if user exists
            const user = yield User_1.default.findOne({ email });
            if (!user) {
                throw new Error('Invalid credentials');
            }
            // Verify password
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }
            // Generate token
            const token = yield this.generateToken(user.id);
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token
            };
        });
    }
    static updateProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findByIdAndUpdate(userId, Object.assign({}, data), { new: true });
            if (!user) {
                throw new Error('User not found');
            }
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                bio: user.bio,
                phoneNumber: user.phoneNumber,
                location: user.location,
                skills: user.skills
            };
        });
    }
    static resetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                // Hash new password
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
                // Update user's password
                const user = yield User_1.default.findByIdAndUpdate(decoded.userId, { password: hashedPassword }, { new: true });
                if (!user) {
                    throw new Error('User not found');
                }
                return { message: 'Password updated successfully' };
            }
            catch (error) {
                throw new Error('Invalid or expired token');
            }
        });
    }
    static changePassword(userId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find user
            const user = yield User_1.default.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // Verify old password
            const isPasswordValid = yield bcrypt_1.default.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                throw new Error('Current password is incorrect');
            }
            // Hash new password
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            // Update password
            user.password = hashedPassword;
            yield user.save();
            return { message: 'Password changed successfully' };
        });
    }
}
exports.default = AuthService;
