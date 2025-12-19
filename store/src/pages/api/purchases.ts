// pages/api/purchases.ts
import { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "@/utils/authenticate";
import Tickets from "@/models/Tickets";
import { ObjectId } from "mongodb";

interface newRequest extends NextApiRequest {
  user: any;
}

async function handler(req: newRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    // --- auth guard: ensure authenticate middleware set req.user ---
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized - missing user" });
    }

    // parse body safely
    const {
      page = 1,
      startDate,
      endDate,
      noTicketWin,
      completeTicketScan,
      ticketWinButNotScan,
    } = req.body ?? {};

    const pageSize = 10;
    const pageNum = Number.isFinite(Number(page)) ? parseInt(String(page), 10) : 1;

    // Build the query (use new ObjectId(...) which is reliable)
    let userId: ObjectId | null = null;
    try {
      userId = new ObjectId(String(req.user.id));
    } catch (e) {
      console.error("Invalid user id for ObjectId:", req.user?.id, e);
      return res.status(400).json({ message: "Invalid user id" });
    }

    const query: any = { user: userId };

    // createdDate range (safer)
    if (startDate) {
      const start = new Date(String(startDate));
      start.setHours(0, 0, 0, 0);
      query.createdDate = { $gte: start };
    } else {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      query.createdDate = { $gte: start };
    }

    if (endDate) {
      const end = new Date(String(endDate));
      end.setHours(23, 59, 59, 999);
      query.createdDate = { ...(query.createdDate ?? {}), $lte: end };
    } else {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      query.createdDate = { ...(query.createdDate ?? {}), $lte: end };
    }

    // Build aggregation pipelines (kept your logic)
    const commonLookupStage = {
  $lookup: {
    from: "sessions",
    let: { session_id: "$session" },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$_id", "$$session_id"] },
              { $lt: ["$endTime", "$$NOW"] } // ✅ endTime < current time
            ]
          }
        }
      },
      { $limit: 1 },
      {
        $project: {
          endTime: 1,
          winner: 1,
          winnerType: 1
        }
      }
    ],
    as: "userData"
  }
};


   const addIsWinnerStage = {
  $addFields: {
    isWinner: {
      $gt: [
        {
          $size: {
            $filter: {
              input: { $ifNull: ["$winner", []] }, // ✅ FIX
              as: "key",
              cond: {
                $in: [
                  "$$key",
                  {
                    $map: {
                      input: { $objectToArray: "$$ROOT" },
                      as: "kv",
                      in: "$$kv.k"
                    }
                  }
                ]
              }
            }
          }
        },
        0
      ]
    }
  }
};


    let aggQueryCnt: any = [
      { $match: query },
      commonLookupStage,
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$userData", 0] }, "$$ROOT"] } } },
      addIsWinnerStage,
    ];

    let aggQuery: any = [
      { $match: query },
      { $sort: { createdDate: -1 } },
      commonLookupStage,
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$userData", 0] }, "$$ROOT"] } } },
      addIsWinnerStage,
    ];

    // Filters for special flags
    if (noTicketWin || completeTicketScan || ticketWinButNotScan) {
      let matchQ: any = {};
      if (completeTicketScan) {
        matchQ.isClaimed = 1;
      } else if (noTicketWin) {
        matchQ.isWinner = false;
      } else if (ticketWinButNotScan) {
        matchQ.isWinner = true;
        matchQ.isClaimed = 0;
      }
      aggQuery.push({ $match: matchQ });
      aggQueryCnt.push({ $match: matchQ });
    }

    // Pagination & projection
    aggQuery.push({ $skip: (pageNum - 1) * pageSize });
    aggQuery.push({ $limit: pageSize });
    aggQuery.push({
      $project: {
        endTime: 1,
        winner: 1,
        winnerType: 1,
        ticketNo: 1,
        createdDate: 1,
        totalAmount: 1,
        isWinner: 1,
        isClaimed: 1,
        isCancel: 1,
      },
    });

    // count pipeline
    aggQueryCnt.push({ $group: { _id: null, myCount: { $sum: 1 } } });
    aggQueryCnt.push({ $project: { _id: 0 } });

    // Execute aggregations
    const transactions = await Tickets.aggregate(aggQuery).toArray?.() ?? await Tickets.aggregate(aggQuery);
    // Some driver wrappers return a cursor; handle both forms:
    const transactionsArray = Array.isArray(transactions) ? transactions : (await transactions.toArray?.()) ?? [];

    let totalDocuments = 0;
    const transactionsCntRes: any = await Tickets.aggregate(aggQueryCnt).toArray?.() ?? await Tickets.aggregate(aggQueryCnt);
    const transactionsCntArray = Array.isArray(transactionsCntRes) ? transactionsCntRes : (await transactionsCntRes.toArray?.()) ?? [];

    if (transactionsCntArray.length > 0) {
      totalDocuments = Number(transactionsCntArray[0].myCount ?? 0);
    }

    // Response
    return res.status(200).json({
      transactions: transactionsArray,
      currentPage: pageNum,
      totalPages: Math.ceil(totalDocuments / pageSize),
      totalDocuments,
    });
  } catch (error: any) {
    console.error("Error fetching transactions:", error && (error.stack || error));
    // Return only message (avoid returning full stack in production). For debugging you can include stack.
    return res.status(500).json({ message: "Server error", error: error?.message ?? String(error) });
  }
}

export default async function (req: newRequest, res: NextApiResponse) {
  return authenticate(req, res, () => handler(req, res));
}
