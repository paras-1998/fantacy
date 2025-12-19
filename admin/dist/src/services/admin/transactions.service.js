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
exports.findNupdateOneById = exports.create = exports.findTransactionTheDay = void 0;
const { TransactionsModel } = require('../../models/transactions');
const findTransactionTheDay = (user_1, dt_1, ...args_1) => __awaiter(void 0, [user_1, dt_1, ...args_1], void 0, function* (user, dt, projection = "_id") { return TransactionsModel.findOne({ user, dt }, projection).lean(); });
exports.findTransactionTheDay = findTransactionTheDay;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () { return TransactionsModel.create(data); });
exports.create = create;
const findNupdateOneById = (_id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return TransactionsModel.findOneAndUpdate({ _id }, data, { new: true }).lean();
});
exports.findNupdateOneById = findNupdateOneById;
//# sourceMappingURL=transactions.service.js.map