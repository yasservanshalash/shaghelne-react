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
const User_1 = __importDefault(require("../models/User"));
class UserController {
    static getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield User_1.default.findById(id).select('-password');
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.status(200).json(user);
            }
            catch (error) {
                console.error('Get user error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const user = yield User_1.default.findById(userId).select('-password');
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.status(200).json(user);
            }
            catch (error) {
                console.error('Get profile error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { name, email, bio, skills, location, hourlyRate, languages } = req.body;
                // Find and update user
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                // Update fields if provided
                if (name)
                    user.name = name;
                if (email)
                    user.email = email;
                if (bio !== undefined)
                    user.bio = bio;
                if (skills)
                    user.skills = skills;
                if (location)
                    user.location = location;
                if (hourlyRate)
                    user.hourlyRate = hourlyRate;
                if (languages)
                    user.languages = languages;
                yield user.save();
                // Return updated user without password
                const updatedUser = yield User_1.default.findById(userId).select('-password');
                return res.status(200).json(updatedUser);
            }
            catch (error) {
                console.error('Update profile error:', error);
                if (error.code === 11000) {
                    return res.status(400).json({ message: 'Email already in use' });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static uploadProfileImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { imageUrl } = req.body;
                // Validate input
                if (!imageUrl) {
                    return res.status(400).json({ message: 'Image URL is required' });
                }
                // Find and update user
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                user.profileImage = imageUrl;
                yield user.save();
                return res.status(200).json({
                    message: 'Profile image updated successfully',
                    profileImage: imageUrl
                });
            }
            catch (error) {
                console.error('Upload profile image error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static searchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, skills, city, role } = req.query;
                const query = {};
                if (name) {
                    query.name = { $regex: name, $options: 'i' };
                }
                if (skills) {
                    const skillsArray = skills.split(',').map(skill => skill.trim());
                    query.skills = { $in: skillsArray };
                }
                if (city) {
                    query['location.city'] = { $regex: city, $options: 'i' };
                }
                if (role) {
                    query.role = role;
                }
                const users = yield User_1.default.find(query).select('-password');
                return res.status(200).json(users);
            }
            catch (error) {
                console.error('Search users error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getPortfolio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const user = yield User_1.default.findById(userId).select('portfolio');
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.status(200).json(user.portfolio || []);
            }
            catch (error) {
                console.error('Get portfolio error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static updatePortfolio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { portfolio } = req.body;
                // Validate input
                if (!portfolio || !Array.isArray(portfolio)) {
                    return res.status(400).json({ message: 'Valid portfolio array is required' });
                }
                // Find and update user
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                user.portfolio = portfolio;
                yield user.save();
                return res.status(200).json(portfolio);
            }
            catch (error) {
                console.error('Update portfolio error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getFreelancers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skills, city, rating } = req.query;
                const query = { role: 'FREELANCER' };
                if (skills) {
                    const skillsArray = skills.split(',').map(skill => skill.trim());
                    query.skills = { $in: skillsArray };
                }
                if (city) {
                    query['location.city'] = { $regex: city, $options: 'i' };
                }
                if (rating) {
                    const minRating = parseFloat(rating);
                    if (!isNaN(minRating)) {
                        query.rating = { $gte: minRating };
                    }
                }
                const freelancers = yield User_1.default.find(query).select('-password');
                return res.status(200).json(freelancers);
            }
            catch (error) {
                console.error('Get freelancers error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
}
exports.default = UserController;
