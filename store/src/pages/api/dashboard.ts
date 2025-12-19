import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import connectToDatabase from "../../lib/mongodb";
import User from "../../models/User";
import { authenticate } from "@/utils/authenticate";

interface newRequest extends NextApiRequest {
  user: any;
}

async function handler(req: newRequest, res: NextApiResponse) {
  

  try {
    

    await connectToDatabase();

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Protected data fetched successfully", user });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token", error });
  }
}


export default async function (req: newRequest, res: NextApiResponse) {
  return authenticate(req, res, () => handler(req, res));
}