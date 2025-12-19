import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongodb";

interface newRequest extends NextApiRequest {
  user: any;
}

export const authenticate = async (req: newRequest, res: NextApiResponse, next: () => void) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decoded : any = jwt.verify(token, process.env.JWT_SECRET!);

    await connectToDatabase(); // Ensure the database is connected

    const user = await User.findById(decoded.id);

    if (!user || user.activeSession !== token) {
      return res.status(401).json({ message: "Invalid or expired session.." });
    }

    req.user = user; // Attach the user to the request for later use
    next(); // Proceed to the route handler
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed", error });
  }
};

export default authenticate;