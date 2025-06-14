import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createSale = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await prisma.sale.create({
      data: {
        ...data,
        isDeleted: false,
      },
      include: { saleItems: true },
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error creating Sale", error });
  }
};

export const getAllSales = async (_: Request, res: Response) => {
  try {
    const result = await prisma.sale.findMany({
      where: { isDeleted: false },
      include: { customer: true, saleItems: true },
    });

    res.status(200).json(
      result.map((item: any) => ({
        ...item,
        customer: item.customer?.name,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Error fetching Sales", error });
  }
};

export const getSaleById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await prisma.sale.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      include: { customer: true, saleItems: true },
    });

    if (!result) return res.status(404).json({ message: "Sale not found" });

    res.status(200).json({
      ...result,
      customer: result.customer?.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Sale", error });
  }
};

export const updateSale = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const result = await prisma.sale.update({
      where: { id },
      data: {
        invoice: req.body.invoice,
        customerId: req.body.customerId,
        orderDate: req.body.orderDate,
        netTotal: req.body.netTotal,
        paid: req.body.paid,
        due: req.body.due,
        status: req.body.status,
        paymentType: req.body.paymentType,
        updatedOn: req.body.updatedOn,
        isDeleted: req.body.isDeleted, 
        saleItems: req.body.saleItems,
      },
      include: { saleItems: true },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating Sale", error });
  }
};

export const deleteSale = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.sale.update({
      where: { id },
      data: { isDeleted: true },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting Sale", error });
  }
};
