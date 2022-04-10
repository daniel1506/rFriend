import jwt from "jsonwebtoken";

export type JWTpayload = {
  id: number;
  email: string;
};

export const generateJWT = (id: number, email: string) => {
  return jwt.sign(
    {
      id: id,
      email: email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: 360000 }
  );
};
