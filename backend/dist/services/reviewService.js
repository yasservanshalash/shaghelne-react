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
const Review_1 = __importDefault(require("../models/Review"));
const Service_1 = __importDefault(require("../models/Service"));
const User_1 = __importDefault(require("../models/User"));
class ReviewService {
    static getAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            let query = {};
            if (filters.serviceId) {
                query.serviceId = filters.serviceId;
            }
            if (filters.userId) {
                query.userId = filters.userId;
            }
            if (filters.minRating !== undefined) {
                query.rating = { $gte: filters.minRating };
            }
            const reviews = yield Review_1.default.find(query);
            return reviews;
        });
    }
    static getById(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield Review_1.default.findById(reviewId);
            if (!review) {
                throw new Error('Review not found');
            }
            return review;
        });
    }
    static create(userId, serviceId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if service exists
            const service = yield Service_1.default.findById(serviceId);
            if (!service) {
                throw new Error('Service not found');
            }
            // Check if user already reviewed this service
            const existingReview = yield Review_1.default.findOne({
                userId,
                serviceId
            });
            if (existingReview) {
                throw new Error('You have already reviewed this service');
            }
            const review = yield Review_1.default.create(Object.assign(Object.assign({}, data), { userId,
                serviceId }));
            // Update service provider's rating
            const serviceProvider = yield User_1.default.findById(service.userId);
            if (serviceProvider) {
                const userReviews = yield Review_1.default.find({
                    serviceId: { $in: yield Service_1.default.find({ userId: serviceProvider.id }).distinct('_id') }
                });
                const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
                const averageRating = totalRating / userReviews.length;
                yield User_1.default.findByIdAndUpdate(serviceProvider.id, {
                    rating: averageRating,
                    totalReviews: userReviews.length
                });
            }
            return review;
        });
    }
    static update(reviewId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield Review_1.default.findByIdAndUpdate(reviewId, Object.assign({}, data), { new: true });
            if (!review) {
                throw new Error('Review not found');
            }
            // Update service provider's rating
            const service = yield Service_1.default.findById(review.serviceId);
            if (service) {
                const serviceProvider = yield User_1.default.findById(service.userId);
                if (serviceProvider) {
                    const userReviews = yield Review_1.default.find({
                        serviceId: { $in: yield Service_1.default.find({ userId: serviceProvider.id }).distinct('_id') }
                    });
                    const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
                    const averageRating = totalRating / userReviews.length;
                    yield User_1.default.findByIdAndUpdate(serviceProvider.id, {
                        rating: averageRating
                    });
                }
            }
            return review;
        });
    }
    static delete(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield Review_1.default.findByIdAndDelete(reviewId);
            if (!review) {
                throw new Error('Review not found');
            }
            // Update service provider's rating
            const service = yield Service_1.default.findById(review.serviceId);
            if (service) {
                const serviceProvider = yield User_1.default.findById(service.userId);
                if (serviceProvider) {
                    const userReviews = yield Review_1.default.find({
                        serviceId: { $in: yield Service_1.default.find({ userId: serviceProvider.id }).distinct('_id') }
                    });
                    let averageRating = 0;
                    if (userReviews.length > 0) {
                        const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
                        averageRating = totalRating / userReviews.length;
                    }
                    yield User_1.default.findByIdAndUpdate(serviceProvider.id, {
                        rating: averageRating,
                        totalReviews: userReviews.length
                    });
                }
            }
            return { message: 'Review deleted successfully' };
        });
    }
    static getByService(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviews = yield Review_1.default.find({ serviceId });
            return reviews;
        });
    }
    static getByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all services by the user
            const services = yield Service_1.default.find({ userId });
            const serviceIds = services.map(service => service.id);
            // Get reviews for those services
            const reviews = yield Review_1.default.find({ serviceId: { $in: serviceIds } });
            return reviews;
        });
    }
}
exports.default = ReviewService;
