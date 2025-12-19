"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const usersSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    status: {
        type: Number,
        enum: [1, 2], // 1-> active , 2 -> deactive
        default: 1,
    },
    isDeleted: {
        type: Number,
        enum: [1, 0], // 0-> not deleted , 1  -> deleted
        default: 0,
    },
    deletedOn: {
        type: String,
        default: "-",
    },
}, {
    timestamps: true,
    collection: "users"
});
usersSchema.index({ username: 'text' });
const users = mongoose_1.default.model('users', usersSchema, "users");
exports.UsersModel = users;
//# sourceMappingURL=users.js.map