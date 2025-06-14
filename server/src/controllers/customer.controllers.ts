import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await prisma.customer.create({
      data: { ...data, isDeleted: false },
    });
    return res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error creating Customer", error });
  }
};

export const getAllCustomers = async (_: Request, res: Response) => {
  try {
    const result = await prisma.customer.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        sales: true,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Customers", error });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await prisma.customer.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });
    if (!result) return res.status(404).json({ message: "Customer not found" });
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Customer", error });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await prisma.customer.update({
      where: { id },
      data: req.body,
    });
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating Customer", error });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.customer.update({
      where: { id },
      data: { isDeleted: true },
    });
    return res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting Customer", error });
  }
};
