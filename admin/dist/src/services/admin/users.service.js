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
exports.deleteUser = exports.countDoc = exports.list = exports.findManyById = exports.findOneById = exports.duplicateusernameValidation = exports.findNupdateOneById = exports.updateOneById = exports.create = void 0;
const { UsersModel } = require('../../models/users');
const create = (data) => __awaiter(void 0, void 0, void 0, function* () { return UsersModel.create(data); });
exports.create = create;
const updateOneById = (_id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return UsersModel.updateOne({ _id }, { $set: data });
});
exports.updateOneById = updateOneById;
const findNupdateOneById = (_id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return UsersModel.findOneAndUpdate({ _id }, data, { new: true }).lean();
});
exports.findNupdateOneById = findNupdateOneById;
const duplicateusernameValidation = (username) => __awaiter(void 0, void 0, void 0, function* () {
    // Function will return true if username is taken
    let countOfSameusername = yield UsersModel.countDocuments({ username });
    if (countOfSameusername > 0) {
        return true;
    }
    else {
        return false;
    }
});
exports.duplicateusernameValidation = duplicateusernameValidation;
const findOneById = (_id_1, ...args_1) => __awaiter(void 0, [_id_1, ...args_1], void 0, function* (_id, projection = "_id") { return UsersModel.findOne({ _id }, projection).lean(); });
exports.findOneById = findOneById;
const findManyById = (_id_1, ...args_1) => __awaiter(void 0, [_id_1, ...args_1], void 0, function* (_id, projection = "_id") { return UsersModel.find({ _id }, projection).lean(); });
exports.findManyById = findManyById;
//export const list = async(user_id,projection = "_id",offset , limit = 10) : Promise<UserInterface[]> => UsersModel.find({},projection).skip((offset - 1) * limit).limit(limit).lean();
const list = (query_1, offset_1, ...args_1) => __awaiter(void 0, [query_1, offset_1, ...args_1], void 0, function* (query, offset, limit = 10) {
    return UsersModel.aggregate([
        {
            $match: query
        },
        { $sort: { createdAt: -1 } },
        {
            $skip: (offset - 1) * limit
        },
        {
            $limit: limit
        },
        { $project: { username: 1, password: 1, balance: 1, id: "$_id", createdAt: 1, status: 1 } }
    ]);
});
exports.list = list;
const countDoc = (qry) => __awaiter(void 0, void 0, void 0, function* () { return UsersModel.countDocuments(qry); });
exports.countDoc = countDoc;
const deleteUser = (_id) => __awaiter(void 0, void 0, void 0, function* () { return UsersModel.deleteOne({ _id }); });
exports.deleteUser = deleteUser;
//# sourceMappingURL=users.service.js.map