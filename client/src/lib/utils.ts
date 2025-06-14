import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSheinId(): string {
  const prefix = "SHEIN";
  const randomNumber = Math.floor(1 + Math.random() * 999); // 1 to 999
  const padded = randomNumber.toString().padStart(3, "0");
  return `${prefix}${padded}`;
}
