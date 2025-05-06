// routes/product.ts
// product router here
import { Router } from "express";
import { createProductController, deleteProductController, getProductsController, updateProductsController } from "../controllers/products";

const router = Router();

router.get("/", getProductsController)
router.post("/", createProductController)
router.delete("/:id", deleteProductController)
router.put("/:id", updateProductsController)

export default router 