import jwt from "jsonwebtoken";


export const verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return { valid: true, expired: false, decoded };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return { valid: false, expired: true, decoded: null };
    } else {
      return { valid: false, expired: false, decoded: null };
    }
  }
};