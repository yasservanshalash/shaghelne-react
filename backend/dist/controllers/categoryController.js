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
const categoryService_1 = __importDefault(require("../services/categoryService"));
class CategoryController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield categoryService_1.default.getAll();
                return res.status(200).json({
                    success: true,
                    data: categories
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield categoryService_1.default.getById(id);
                if (!category) {
                    return res.status(404).json({
                        success: false,
                        message: 'Category not found'
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: category
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Only admin can create categories
                if (req.user.role !== 'ADMIN') {
                    return res.status(403).json({
                        success: false,
                        message: 'Only administrators can create categories'
                    });
                }
                const data = req.body;
                // Validation
                if (!data.name || !data.description) {
                    return res.status(400).json({
                        success: false,
                        message: 'Name and description are required'
                    });
                }
                const category = yield categoryService_1.default.create(data);
                return res.status(201).json({
                    success: true,
                    data: category
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Only admin can update categories
                if (req.user.role !== 'ADMIN') {
                    return res.status(403).json({
                        success: false,
                        message: 'Only administrators can update categories'
                    });
                }
                const { id } = req.params;
                const data = req.body;
                const category = yield categoryService_1.default.getById(id);
                if (!category) {
                    return res.status(404).json({
                        success: false,
                        message: 'Category not found'
                    });
                }
                const updatedCategory = yield categoryService_1.default.update(id, data);
                return res.status(200).json({
                    success: true,
                    data: updatedCategory
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Only admin can delete categories
                if (req.user.role !== 'ADMIN') {
                    return res.status(403).json({
                        success: false,
                        message: 'Only administrators can delete categories'
                    });
                }
                const { id } = req.params;
                const category = yield categoryService_1.default.getById(id);
                if (!category) {
                    return res.status(404).json({
                        success: false,
                        message: 'Category not found'
                    });
                }
                yield categoryService_1.default.delete(id);
                return res.status(200).json({
                    success: true,
                    message: 'Category deleted successfully'
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
    static getSubcategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield categoryService_1.default.getById(id);
                if (!category) {
                    return res.status(404).json({
                        success: false,
                        message: 'Category not found'
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: category.subcategories
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
    static search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req.query;
                if (!query || typeof query !== 'string') {
                    return res.status(400).json({
                        success: false,
                        message: 'Search query is required'
                    });
                }
                const categories = yield categoryService_1.default.search(query);
                return res.status(200).json({
                    success: true,
                    data: categories
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
}
exports.default = CategoryController;
