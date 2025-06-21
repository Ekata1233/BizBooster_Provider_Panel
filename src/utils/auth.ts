// src/lib/auth.ts
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(id: string) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
}

export async function getUserIdFromRequest(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
  } catch (e) {
    console.log(e);
    
    return null;
  }
}
