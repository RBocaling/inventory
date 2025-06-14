import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await prisma.product.create({
      data: { ...data, isDeleted: false },
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error creating Product", error });
  }
};

export const getAllProducts = async (_: Request, res: Response) => {
  try {
    const result = await prisma.product.findMany({
      where: { isDeleted: false },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Products", error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await prisma.product.findFirst({
      where: { id, isDeleted: false },
    });
    if (!result) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Product", error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating Product", error });
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
