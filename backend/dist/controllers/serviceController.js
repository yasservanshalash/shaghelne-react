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
const serviceService_1 = __importDefault(require("../services/serviceService"));
class ServiceController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category, minPrice, maxPrice, status, deliveryTime, page, limit } = req.query;
                const filters = {};
                if (category)
                    filters.category = category;
                if (minPrice)
                    filters.minPrice = parseFloat(minPrice);
                if (maxPrice)
                    filters.maxPrice = parseFloat(maxPrice);
                if (status)
                    filters.status = status;
                if (deliveryTime)
                    filters.deliveryTime = parseInt(deliveryTime, 10);
                if (page)
                    filters.page = parseInt(page, 10);
                if (limit)
                    filters.limit = parseInt(limit, 10);
                const result = yield serviceService_1.default.getAll(filters);
                return res.status(200).json(result);
            }
            catch (error) {
                console.error('Get services error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const service = yield serviceService_1.default.getById(id);
                return res.status(200).json(service);
            }
            catch (error) {
                console.error('Get service error:', error);
                if (error.message === 'Service not found') {
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
                const serviceData = req.body;
                // Validate required fields
                if (!serviceData.title || !serviceData.description || !serviceData.price ||
                    !serviceData.category || !serviceData.deliveryTime || !serviceData.revisions) {
                    return res.status(400).json({
                        message: 'Required fields: title, description, price, category, deliveryTime, revisions'
                    });
                }
                const service = yield serviceService_1.default.create(userId, serviceData);
                return res.status(201).json(service);
            }
            catch (error) {
                console.error('Create service error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const serviceData = req.body;
                // Find service first to verify ownership
                const service = yield serviceService_1.default.getById(id);
                // Verify ownership
                if (service.userId.toString() !== userId) {
                    return res.status(403).json({ message: 'Unauthorized - you can only update your own services' });
                }
                const updatedService = yield serviceService_1.default.update(id, serviceData);
                return res.status(200).json(updatedService);
            }
            catch (error) {
                console.error('Update service error:', error);
                if (error.message === 'Service not found') {
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
                // Find service first to verify ownership
                const service = yield serviceService_1.default.getById(id);
                // Verify ownership
                if (service.userId.toString() !== userId) {
                    return res.status(403).json({ message: 'Unauthorized - you can only delete your own services' });
                }
                yield serviceService_1.default.delete(id);
                return res.status(200).json({ message: 'Service deleted successfully' });
            }
            catch (error) {
                console.error('Delete service error:', error);
                if (error.message === 'Service not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const services = yield serviceService_1.default.getByUser(userId);
                return res.status(200).json(services);
            }
            catch (error) {
                console.error('Get services by user error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static uploadImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                // In a real implementation, you would:
                // 1. Handle file upload (with multer middleware)
                // 2. Store the file (e.g. on S3, local filesystem)
                // 3. Get the image URL
                const imageUrl = req.body.imageUrl; // Simplification - in real app, get from file upload
                if (!imageUrl) {
                    return res.status(400).json({ message: 'Image URL is required' });
                }
                // Find service first to verify ownership
                const service = yield serviceService_1.default.getById(id);
                // Verify ownership
                if (service.userId.toString() !== userId) {
                    return res.status(403).json({ message: 'Unauthorized - you can only upload images to your own services' });
                }
                const updatedService = yield serviceService_1.default.uploadImage(id, imageUrl);
                return res.status(200).json(updatedService);
            }
            catch (error) {
                console.error('Upload service image error:', error);
                if (error.message === 'Service not found') {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query, category, minPrice, maxPrice, page, limit } = req.query;
                const criteria = {};
                if (query)
                    criteria.query = query;
                if (category)
                    criteria.category = category;
                if (minPrice)
                    criteria.minPrice = parseFloat(minPrice);
                if (maxPrice)
                    criteria.maxPrice = parseFloat(maxPrice);
                if (page)
                    criteria.page = parseInt(page, 10);
                if (limit)
                    criteria.limit = parseInt(limit, 10);
                const result = yield serviceService_1.default.search(criteria);
                return res.status(200).json(result);
            }
            catch (error) {
                console.error('Search services error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    }
}
exports.default = ServiceController;
