import jwt from "jsonwebtoken";

export const generateJWT = (id: number, email: string) => {
  return jwt.sign(
    {
      id: id,
      email: email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: 36000 }
  );
};
