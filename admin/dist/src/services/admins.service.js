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
exports.deleteManyById = exports.deleteOneById = exports.countDoc = exports.list = exports.findOneByEmail = exports.findOneById = exports.duplicateEmailValidation = exports.findNupdateOneById = exports.create = void 0;
const { AdminsModel } = require('../models/admins');
const create = (data) => __awaiter(void 0, void 0, void 0, function* () { return AdminsModel.create(data); });
exports.create = create;
const findNupdateOneById = (_id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return AdminsModel.findOneAndUpdate({ _id }, { $set: data }, { new: true }).lean();
});
exports.findNupdateOneById = findNupdateOneById;
const duplicateEmailValidation = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // Function will return true if email is taken
    let countOfSameEmail = yield AdminsModel.countDocuments({ email });
    if (countOfSameEmail > 0) {
        return true;
    }
    else {
        return false;
    }
});
exports.duplicateEmailValidation = duplicateEmailValidation;
const findOneById = (_id_1, ...args_1) => __awaiter(void 0, [_id_1, ...args_1], void 0, function* (_id, projection = "_id") { return AdminsModel.findOne({ _id }, projection).lean(); });
exports.findOneById = findOneById;
const findOneByEmail = (email_1, ...args_1) => __awaiter(void 0, [email_1, ...args_1], void 0, function* (email, projection = "_id") { return AdminsModel.findOne({ email }, projection).lean(); });
exports.findOneByEmail = findOneByEmail;
const list = (user_id_1, offset_1, ...args_1) => __awaiter(void 0, [user_id_1, offset_1, ...args_1], void 0, function* (user_id, offset, limit = 10) {
    return AdminsModel.aggregate([
        {
            $skip: (offset - 1) * limit
        },
        {
            $limit: limit
        },
        { $project: { name: 1, email: 1, id: "$_id" } }
    ]);
});
exports.list = list;
const countDoc = (qry) => __awaiter(void 0, void 0, void 0, function* () { return AdminsModel.countDocuments(qry); });
exports.countDoc = countDoc;
const deleteOneById = (_id) => __awaiter(void 0, void 0, void 0, function* () { return AdminsModel.deleteOne({ _id }); });
exports.deleteOneById = deleteOneById;
const deleteManyById = (_ids) => __awaiter(void 0, void 0, void 0, function* () { return AdminsModel.deleteMany({ _id: { $in: _ids } }); });
exports.deleteManyById = deleteManyById;
//# sourceMappingURL=admins.service.js.map