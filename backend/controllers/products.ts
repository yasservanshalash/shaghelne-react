// logic to deal with request and response here
import { Request, Response } from "express";

import ProductServices from "../services/products";
import Product from "../models/Product";

export const createProductController = async (req: Request, res: Response) => {
  try {
    const newProduct = new Product({
      "name": req.body.name,
    });

    const product = await ProductServices.createProduct(newProduct);

    res.json(product);
  } catch (error) {
    console.log(error);
  }
};


export const getProductsController = async (req: Request, res: Response) => {
    try {
        const products = await ProductServices.getProducts();
        res.json(products)
    } catch(error) {
        console.log(error);
    }
}

export const deleteProductController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const product = await ProductServices.deleteProduct(id);
        res.json(product)
    } catch (error) {
        console.log(error);
    }
}

export const updateProductsController = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const newData = req.body
      const product = await ProductServices.updateProducts(id, newData)
      res.json(product);
    } catch (error) {
        console.log(error);
    }
} 