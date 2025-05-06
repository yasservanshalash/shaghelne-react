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
const reviewService_1 = __importDefault(require("../services/reviewService"));
class ReviewController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { serviceId, userId, minRating } = req.query;
                const filters = {};
                if (serviceId)
                    filters.serviceId = serviceId;
                if (userId)
                    filters.userId = userId;
                if (minRating)
                    filters.minRating = parseInt(minRating, 10);
                const reviews = yield reviewService_1.default.getAll(filters);
                return res.status(200).json(reviews);
            }
            catch (error) {
                console.error('Get reviews error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const review = yield reviewService_1.default.getById(id);
                return res.status(200).json(review);
            }
            catch (error) {
                console.error('Get review error:', error);
                if (error.message === 'Review not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { serviceId, rating, comment } = req.body;
                // Validate required fields
                if (!serviceId || !rating) {
                    return res.status(400).json({
                        message: 'Required fields: serviceId, rating'
                    });
                }
                // Validate rating
                const ratingNum = parseInt(rating, 10);
                if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
                    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
                }
                const reviewData = {
                    serviceId,
                    rating: ratingNum,
                    comment
                };
                const review = yield reviewService_1.default.create(userId, reviewData);
                return res.status(201).json(review);
            }
            catch (error) {
                console.error('Create review error:', error);
                if (error.message === 'You have already reviewed this service') {
                    return res.status(400).json({ message: error.message });
                }
                if (error.message === 'Service not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const { rating, comment } = req.body;
                // Verify ownership
                const review = yield reviewService_1.default.getById(id);
                if (review.userId.toString() !== userId) {
                    return res.status(403).json({
                        message: 'Unauthorized - you can only update your own reviews'
                    });
                }
                const updateData = {};
                if (rating !== undefined) {
                    // Validate rating
                    const ratingNum = parseInt(rating, 10);
                    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
                        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
                    }
                    updateData.rating = ratingNum;
                }
                if (comment !== undefined) {
                    updateData.comment = comment;
                }
                const updatedReview = yield reviewService_1.default.update(id, updateData);
                return res.status(200).json(updatedReview);
            }
            catch (error) {
                console.error('Update review error:', error);
                if (error.message === 'Review not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                // Verify ownership
                const review = yield reviewService_1.default.getById(id);
                if (review.userId.toString() !== userId) {
                    return res.status(403).json({
                        message: 'Unauthorized - you can only delete your own reviews'
                    });
                }
                yield reviewService_1.default.delete(id);
                return res.status(200).json({ message: 'Review deleted successfully' });
            }
            catch (error) {
                console.error('Delete review error:', error);
                if (error.message === 'Review not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getByService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { serviceId } = req.params;
                const reviews = yield reviewService_1.default.getByService(serviceId);
                return res.status(200).json(reviews);
            }
            catch (error) {
                console.error('Get service reviews error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const reviews = yield reviewService_1.default.getByUser(userId);
                return res.status(200).json(reviews);
            }
            catch (error) {
                console.error('Get user reviews error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
}
exports.default = ReviewController;
