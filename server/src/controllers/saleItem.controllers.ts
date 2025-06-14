import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createSaleItem = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await prisma.saleItem.create({ data });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error creating SaleItem", error });
  }
};

export const getAllSaleItems = async (_: Request, res: Response) => {
  try {
    const result = await prisma.saleItem.findMany({
      include: { product: true, sale: true },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching SaleItems", error });
  }
};

export const getSaleItemById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await prisma.saleItem.findUnique({
      where: { id },
      include: { product: true, sale: true },
    });
    if (!result) return res.status(404).json({ message: "SaleItem not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching SaleItem", error });
  }
};

export const updateSaleItem = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await prisma.saleItem.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating SaleItem", error });
  }
};

export const deleteSaleItem = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.saleItem.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting SaleItem", error });
  }
};
