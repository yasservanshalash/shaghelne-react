// product services here - logic to communicate with database

import { ProductDocument } from "../models/Product";
import Product from "../models/Product";

const createProduct = async (product: ProductDocument): Promise<ProductDocument> => {
    return product.save();
}

const getProducts = async (): Promise<ProductDocument[]> => {
    return Product.find();
}

const deleteProduct = async (id: string): Promise<ProductDocument | null> => {
    return Product.findByIdAndDelete(id);
}

const updateProducts = async (id: string, newData: ProductDocument): Promise<ProductDocument | null> => {
    return Product.findByIdAndUpdate(id, newData);
}

export default { createProduct, getProducts, deleteProduct, updateProducts } 