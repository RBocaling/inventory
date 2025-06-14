import jwt from 'jsonwebtoken';

export const generateAccessToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET! || "847422251088bbcd28ff6d02afef84d5", { expiresIn: '7d' }); 
};

export const generateRefreshToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET! || "847422251088bbcd28ff6d02afef84ds5", { expiresIn: '7d' }); 
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
};
