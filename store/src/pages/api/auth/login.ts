import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { username, password } = req.body;

  try {
    console.log('[LOGIN] Attempting login for:', username);
    
    await connectToDatabase();
    console.log('[LOGIN] Connected to database');

    // Search by username or email
    const user = await User.findOne({ 
      $or: [
        { username: username },
        { email: username }
      ]
    });

    console.log('[LOGIN] User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('[LOGIN] User not found for:', username);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log('[LOGIN] Checking password. Input:', password, 'Stored:', user.password);

    if (!(password == user.password)) {
      console.log('[LOGIN] Password mismatch');
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log('[LOGIN] Status check:', user.status);

    if (user.status !== 1) {
      return res.status(401).json({ message: "deactivated account." });
    }

    console.log('[LOGIN] Generating token for user:', user._id);

    // Invalidate existing session
    if (user.activeSession) {
      await invalidateSession(user.activeSession);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "24h" });

    // Save the new token in the database
    await User.updateOne({_id:user._id},{$set:{activeSession : token }});

    console.log('[LOGIN] Login successful for:', username);
    res.status(200).json({ token });
  } catch (error) {
    console.error('[LOGIN] Error:', error);
    res.status(500).json({ message: "Error logging in", error: String(error) });
  }
}


// Helper function to invalidate session
const invalidateSession = async (token:string) => {
  try {
    const decoded : any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.userId);
    if (user && user.activeSession === token) {
      user.activeSession = null;
      await user.save();
    }
  } catch (error) {
    console.error("Error invalidating session:", error);
  }
};