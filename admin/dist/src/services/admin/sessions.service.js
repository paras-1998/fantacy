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
exports.deleteSession = exports.findOneById = exports.countDoc = exports.list = exports.findManyById = exports.findNupdateOneById = exports.create = void 0;
const { SessionsModel } = require('../../models/sessions');
//export const list = async(query,projection = "_id",offset , limit = 10) : Promise<SessionInterface[]> => SessionsModel.find(query,projection).skip((offset - 1) * limit).limit(limit).lean();
const create = (data) => __awaiter(void 0, void 0, void 0, function* () { return SessionsModel.create(data); });
exports.create = create;
const findNupdateOneById = (_id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return SessionsModel.findOneAndUpdate({ _id }, { $set: data }, { new: true }).lean();
});
exports.findNupdateOneById = findNupdateOneById;
const findManyById = (_id_1, ...args_1) => __awaiter(void 0, [_id_1, ...args_1], void 0, function* (_id, projection = "_id") { return SessionsModel.find({ _id }, projection).lean(); });
exports.findManyById = findManyById;
const list = (query_1, offset_1, ...args_1) => __awaiter(void 0, [query_1, offset_1, ...args_1], void 0, function* (query, offset, limit = 10) {
    return SessionsModel.aggregate([
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
                from: 'tickets',
                let: { session_id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$session", "$$session_id"] }
                        },
                    },
                    {
                        $group: {
                            _id: "$user",
                            totalShree: { $sum: "$Shree" },
                            totalVashikaran: { $sum: "$Vashikaran" },
                            totalSudarshan: { $sum: "$Sudarshan" },
                            totalVastu: { $sum: "$Vastu" },
                            totalPlanet: { $sum: "$Planet" },
                            totalLove: { $sum: "$Love" },
                            totalTara: { $sum: "$Tara" },
                            totalGrah: { $sum: "$Grah" },
                            totalMatsya: { $sum: "$Matsya" },
                            totalMeditation: { $sum: "$Meditation" },
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            let: { user_id: "$_id" },
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
                    //{ $limit : 1 },
                    { $project: { userData: 0 } }
                ],
                as: 'ticketsData'
            }
        },
        { $addFields: { id: "$_id" } }
    ]);
});
exports.list = list;
const countDoc = (qry) => __awaiter(void 0, void 0, void 0, function* () { return SessionsModel.countDocuments(qry); });
exports.countDoc = countDoc;
const findOneById = (_id_1, ...args_1) => __awaiter(void 0, [_id_1, ...args_1], void 0, function* (_id, projection = "_id") { return SessionsModel.findOne({ _id }, projection).lean(); });
exports.findOneById = findOneById;
const deleteSession = (_id) => __awaiter(void 0, void 0, void 0, function* () { return SessionsModel.deleteOne({ _id }); });
exports.deleteSession = deleteSession;
//# sourceMappingURL=sessions.service.js.map