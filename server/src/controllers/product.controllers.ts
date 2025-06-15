import { ProductHistory } from "./../../node_modules/.prisma/client/index.d";
import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const user = req.user;

    const result = await prisma.product.create({
      data: {
        ...data,
        isDeleted: false,
        productHistory: {
          create: {
            quantity: data?.quantity,
            originalStockAdded: data?.quantity,
            addedBy: user?.role,
            updatedOn: new Date(),
          },
        },
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error creating Product", error });
  }
};

export const getAllProducts = async (_: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isDeleted: false },
      include: { saleItems: true, productHistory: true },
    });

    const updatedProducts = products.map((product) => {
      const soldQuantity = product.saleItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      const stock = product.quantity;
      const remainingStock = stock - soldQuantity;

      return {
        ...product,
        stock,
        remainingStock,
      };
    });

    res.status(200).json(updatedProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Products", error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { saleItems: true, productHistory: true },
    });

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    const soldQuantity = product.saleItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const stock = product.quantity;
    const remainingStock = stock - soldQuantity;

    const updatedProduct = {
      ...product,
      stock,
      remainingStock,
    };

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Product", error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const user = req.user;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: {
        quantity: true,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const currentStock = existingProduct.quantity;
    const updatedQuantity = data.quantity;
    const originalStockAdded = updatedQuantity - currentStock;

    const result = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        productHistory: {
          create: {
            quantity: updatedQuantity,
            originalStockAdded: originalStockAdded > 0 ? originalStockAdded : 0,
            addedBy: user?.role || "unknown",
            updatedOn: new Date(),
          },
        },
      },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting Product", error });
  }
};
