import bcrypt from "bcrypt";

export const hashValue = async (plainText,saltRounds = 10) => {
  try {
    const hashed = await bcrypt.hash(plainText, saltRounds);
    return hashed;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const compareValue = async (plainText, hashedValue) => {
  try {
    const isMatch = await bcrypt.compare(plainText, hashedValue);
    return isMatch;
  } catch (error) {
    console.error(error);
    return false;
  }
};
