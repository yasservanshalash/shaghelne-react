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
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importStar(require("../models/User"));
class UserService {
    static getById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(userId);
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
                profileImage: user.profileImage,
                location: user.location,
                skills: user.skills,
                rating: user.rating,
                totalReviews: user.totalReviews,
                completedJobs: user.completedJobs,
                isVerified: user.isVerified
            };
        });
    }
    static getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getById(userId);
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
                profileImage: user.profileImage,
                location: user.location,
                skills: user.skills,
                rating: user.rating,
                totalReviews: user.totalReviews,
                completedJobs: user.completedJobs,
                isVerified: user.isVerified
            };
        });
    }
    static uploadProfileImage(userId, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findByIdAndUpdate(userId, { profileImage: imageUrl }, { new: true });
            if (!user) {
                throw new Error('User not found');
            }
            return {
                id: user.id,
                profileImage: user.profileImage
            };
        });
    }
    static searchUsers(criteria) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {};
            if (criteria.name) {
                query.name = { $regex: criteria.name, $options: 'i' };
            }
            if (criteria.skills && criteria.skills.length > 0) {
                query.skills = { $in: criteria.skills };
            }
            if (criteria.location) {
                if (criteria.location.city) {
                    query['location.city'] = criteria.location.city;
                }
                if (criteria.location.subCity) {
                    query['location.subCity'] = criteria.location.subCity;
                }
            }
            if (criteria.role) {
                query.role = criteria.role;
            }
            const users = yield User_1.default.find(query);
            return users.map(user => ({
                id: user.id,
                name: user.name,
                role: user.role,
                bio: user.bio,
                profileImage: user.profileImage,
                location: user.location,
                skills: user.skills,
                rating: user.rating,
                totalReviews: user.totalReviews,
                completedJobs: user.completedJobs,
            }));
        });
    }
    static getPortfolio(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user.portfolio;
        });
    }
    static updatePortfolio(userId, portfolio) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findByIdAndUpdate(userId, { portfolio }, { new: true });
            if (!user) {
                throw new Error('User not found');
            }
            return user.portfolio;
        });
    }
    static getFreelancers(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = { role: User_1.Role.FREELANCER };
            if (filters.skills && filters.skills.length > 0) {
                query.skills = { $in: filters.skills };
            }
            if (filters.location) {
                if (filters.location.city) {
                    query['location.city'] = filters.location.city;
                }
            }
            if (filters.rating) {
                query.rating = { $gte: filters.rating };
            }
            const freelancers = yield User_1.default.find(query);
            return freelancers.map(user => ({
                id: user.id,
                name: user.name,
                bio: user.bio,
                profileImage: user.profileImage,
                location: user.location,
                skills: user.skills,
                rating: user.rating,
                totalReviews: user.totalReviews,
                completedJobs: user.completedJobs,
            }));
        });
    }
}
exports.default = UserService;
