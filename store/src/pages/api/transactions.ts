import { NextApiRequest, NextApiResponse } from "next";

import jwt from "jsonwebtoken";

import { authenticate } from "@/utils/authenticate";

import Transaction from "@/models/Transactions";

interface newRequest extends NextApiRequest {
  user: any;
}




async function handler(req: newRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  
  try {
    const { page = 1, startDate, endDate } = req.body;
    const pageSize = 10;
    const pageNum = parseInt(page as string, 10);

    // Build the query
    const query: any = { user : req.user.id };
    if (startDate) {
        const start = new Date(startDate as string);
        start.setHours(0, 0, 0, 0); // Set time to 00:00:00
        query.createdDate = { $gte: start };
    }
    else{
      const start = new Date();
        start.setHours(0, 0, 0, 0); // Set time to 00:00:00
        query.createdDate = { $gte: start };
    }
    if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999); // Set time to 23:59:59
        query.createdDate = {
            ...query.createdDate,
            $lte: end,
        };
    }
    else{
        const end = new Date();
        end.setHours(23, 59, 59, 999); // Set time to 23:59:59
        query.createdDate = {
            ...query.createdDate,
            $lte: end,
        };
    }
    // Calculate total documents for pagination
    const totalDocuments = await Transaction.countDocuments(query);

    // Fetch paginated data
    const transactions = await Transaction.find(query)
      .sort({ createdDate: -1 }) // Sort by most recent date
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);

    // Response
    res.status(200).json({
      transactions,
      currentPage: pageNum,
      totalPages: Math.ceil(totalDocuments / pageSize),
      totalDocuments,
    });

  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error", error });
  }

}

export default async function (req: newRequest, res: NextApiResponse) {
  return authenticate(req, res, () => handler(req, res));
}