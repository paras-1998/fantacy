import { NextApiRequest, NextApiResponse } from "next";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

import { authenticate } from "@/utils/authenticate";

interface newRequest extends NextApiRequest {
  user: any;
}


async function handler(req: newRequest, res: NextApiResponse) {
    
    if (req.method !== "POST") {
      return res.status(405).end();
    }
  
    const { currentPassword, newPassword } = req.body;
  
    try {
        
        await connectToDatabase();
  
      
      const user = await User.findById(req.user.id);
  
      if (!user || !( currentPassword == user.password )) {
        return res.status(400).json({ message: "Current password is incorrect." });
      }

      await User.updateOne({_id:req.user.id},{ $set : {password: newPassword} });

      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
}
  
export default async function (req: newRequest, res: NextApiResponse) {
  return authenticate(req, res, () => handler(req, res));
}