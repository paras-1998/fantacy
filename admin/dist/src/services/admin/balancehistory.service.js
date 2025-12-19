"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countDoc = exports.list = exports.create = void 0;
const { BalancehistoryModel } = require('../../models/balancehistory');
const create = (data) => __awaiter(void 0, void 0, void 0, function* () { return BalancehistoryModel.create(data); });
exports.create = create;
const list = (query_1, offset_1, ...args_1) => __awaiter(void 0, [query_1, offset_1, ...args_1], void 0, function* (query, offset, limit = 10) {
    return BalancehistoryModel.aggregate([
        {
            $match: query
        },
        { $sort: { startTime: -1 } },
        {
            $skip: (offset - 1) * limit
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: 'users',
                let: { user_id: "$user" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$user_id"] }
                        },
                    },
                    { $limit: 1 },
                    { $project: { username: 1 } }
                ],
                as: 'userData'
            }
        },
        { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$userData", 0] }, "$$ROOT"] } } },
        {
            $lookup: {
                from: 'admins',
                let: { admin_id: "$admin" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$admin_id"] }
                        },
                    },
                    { $limit: 1 },
                    { $project: { name: 1 } }
                ],
                as: 'adminData'
            }
        },
        { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$adminData", 0] }, "$$ROOT"] } } },
        { $addFields: { id: "$_id" } },
        { $project: { amount: 1, createdAt: 1, name: 1, id: 1, username: 1 } }
    ]);
});
exports.list = list;
const countDoc = (qry) => __awaiter(void 0, void 0, void 0, function* () { return BalancehistoryModel.countDocuments(qry); });
exports.countDoc = countDoc;
//# sourceMappingURL=balancehistory.service.js.map