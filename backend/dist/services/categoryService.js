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
const Category_1 = __importDefault(require("../models/Category"));
class CategoryService {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return Category_1.default.find().sort({ name: 1 }).exec();
        });
    }
    static getById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Category_1.default.findById(categoryId).exec();
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if category with same name exists
            const existingCategory = yield Category_1.default.findOne({ name: data.name });
            if (existingCategory) {
                throw new Error('Category with this name already exists');
            }
            const category = new Category_1.default({
                name: data.name,
                description: data.description,
                subcategories: data.subcategories || [],
                icon: data.icon
            });
            return category.save();
        });
    }
    static update(categoryId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for duplicate name if name is being updated
            if (data.name) {
                const existingCategory = yield Category_1.default.findOne({
                    name: data.name,
                    _id: { $ne: categoryId }
                });
                if (existingCategory) {
                    throw new Error('Category with this name already exists');
                }
            }
            return Category_1.default.findByIdAndUpdate(categoryId, { $set: data }, { new: true, runValidators: true }).exec();
        });
    }
    static delete(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Category_1.default.findByIdAndDelete(categoryId).exec();
        });
    }
    static getByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return Category_1.default.findOne({ name }).exec();
        });
    }
    static getSubcategories(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield Category_1.default.findById(categoryId).exec();
            return category ? category.subcategories : [];
        });
    }
    static addSubcategory(categoryId, subcategory) {
        return __awaiter(this, void 0, void 0, function* () {
            return Category_1.default.findByIdAndUpdate(categoryId, { $addToSet: { subcategories: subcategory } }, { new: true }).exec();
        });
    }
    static removeSubcategory(categoryId, subcategory) {
        return __awaiter(this, void 0, void 0, function* () {
            return Category_1.default.findByIdAndUpdate(categoryId, { $pull: { subcategories: subcategory } }, { new: true }).exec();
        });
    }
    static search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(query, 'i');
            return Category_1.default.find({
                $or: [
                    { name: regex },
                    { description: regex },
                    { subcategories: regex }
                ]
            }).sort({ name: 1 }).exec();
        });
    }
}
exports.default = CategoryService;
