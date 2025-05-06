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
exports.updateProductsController = exports.deleteProductController = exports.getProductsController = exports.createProductController = void 0;
const products_1 = __importDefault(require("../services/products"));
const Product_1 = __importDefault(require("../models/Product"));
const createProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newProduct = new Product_1.default({
            "name": req.body.name,
        });
        const product = yield products_1.default.createProduct(newProduct);
        res.json(product);
    }
    catch (error) {
        console.log(error);
    }
});
exports.createProductController = createProductController;
const getProductsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield products_1.default.getProducts();
        res.json(products);
    }
    catch (error) {
        console.log(error);
    }
});
exports.getProductsController = getProductsController;
const deleteProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const product = yield products_1.default.deleteProduct(id);
        res.json(product);
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteProductController = deleteProductController;
const updateProductsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const newData = req.body;
        const product = yield products_1.default.updateProducts(id, newData);
        res.json(product);
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateProductsController = updateProductsController;
