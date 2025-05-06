"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/product.ts
// product router here
const express_1 = require("express");
const products_1 = require("../controllers/products");
const router = (0, express_1.Router)();
router.get("/", products_1.getProductsController);
router.post("/", products_1.createProductController);
router.delete("/:id", products_1.deleteProductController);
router.put("/:id", products_1.updateProductsController);
exports.default = router;
