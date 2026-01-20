import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (payload,secret ,expiresIn = "7d") => {
  return jwt.sign(payload, secret, { expiresIn });
};