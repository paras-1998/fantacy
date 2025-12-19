import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "@/utils/authenticate";
import User from "../../../models/User";
interface newRequest extends NextApiRequest {
  user: any;
}


async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(401).json({ valid: false });
    }
  
    const { token } = req.body;
  
    try {
        const decoded : any =jwt.verify(token, process.env.JWT_SECRET!);
        const user = await User.findById(decoded.id);
        if (user.status !== 1) {
          return res.status(401).json({ message: "deactivated account." });
        }
        res.status(200).json({ valid: true });
      } catch (error) {
        res.status(401).json({ valid: false });
      }
  }


export default async function (req: newRequest, res: NextApiResponse) {
  return authenticate(req, res, () => handler(req, res));
}