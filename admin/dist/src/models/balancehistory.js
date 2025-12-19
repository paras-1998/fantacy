"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalancehistoryModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const balancehistorySchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    admin: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true }, // opneing balance
}, {
    timestamps: true,
    collection: "balancehistory"
});
balancehistorySchema.index({ admin: 'text' });
const balancehistory = mongoose_1.default.model('balancehistory', balancehistorySchema, "balancehistory");
exports.BalancehistoryModel = balancehistory;
//# sourceMappingURL=balancehistory.js.map