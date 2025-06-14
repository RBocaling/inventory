import { Request, Response } from "express";
import argon2 from "argon2";
import prisma from "../config/prisma";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

export const register = async (req: Request, res: Response) => {
  const {
    email,
    password,
    role,
    username,
    name,
    contact,
    address,
    idNumber,
  } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already taken" });
    }

    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        username,
        name,
        contact,
        address,
        idNumber,
        isDeleted:false
      },
    });

    return res.status(201).json({ message: "User registered", userId: user.id });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to register user", error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.isDeleted) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return res.status(200).json({
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};


export const getUserAuth = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(req.user?.id),
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        name:true
      },
    });

    return res.status(201).json(user);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
}


export const getUserList = async (req: Request, res: Response) => {
  try {    
    const user = await prisma.user.findMany({
      where:{isDeleted:false},
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        contact: true,
        name: true,
        address: true,
        idNumber:true
      },
    });

    return res.status(201).json(user);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await prisma.user.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });
        if (!result) return res.status(404).json({ message: "user not found" });
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Customer", error });
  }
};


export const updateUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const {
    email,
    password,
    role,
    username,
    name,
    contact,
    address,
    idNumber,
    isDeleted
  } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        password: password ? await argon2.hash(password) : user.password,
        role,
        username,
        name,
        contact,
        address,
        idNumber,
isDeleted
      },
    });

    return res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};
