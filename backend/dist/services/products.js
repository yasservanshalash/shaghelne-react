"use strict";
// product services here - logic to communicate with database
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
const Product_1 = __importDefault(require("../models/Product"));
const createProduct = (product) => __awaiter(void 0, void 0, void 0, function* () {
    return product.save();
});
const getProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    return Product_1.default.find();
});
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return Product_1.default.findByIdAndDelete(id);
});
const updateProducts = (id, newData) => __awaiter(void 0, void 0, void 0, function* () {
    return Product_1.default.findByIdAndUpdate(id, newData);
});
exports.default = { createProduct, getProducts, deleteProduct, updateProducts };
