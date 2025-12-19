"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const transactionsSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    dt: { type: String }, // date 
    ob: { type: Number }, // opneing balance
    ar: { type: Number, default: 0 }, // admin recharege
    cb: { type: Number, default: 0 }, // closing balance
    ap: { type: Number, default: 0 }, // agent purchese
    aw: { type: Number, default: 0 }, // agent win
    aComm: { type: Number, default: 0 }, // agent commision
    aPay: { type: Number, default: 0 }, // admin pay
    createdDate: { type: Date, default: Date.now },
}, {
    timestamps: true,
    collection: "transactions"
});
transactionsSchema.index({ user: 'text' });
const transactions = mongoose_1.default.model('transactions', transactionsSchema, "transactions");
exports.TransactionsModel = transactions;
//# sourceMappingURL=transactions.js.map