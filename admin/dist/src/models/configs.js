"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const configsSchema = new mongoose_1.default.Schema({
    commissionPercentage: { type: Number, default: 0 },
}, {
    timestamps: true,
    collection: "configs"
});
const configs = mongoose_1.default.model('configs', configsSchema, "configs");
exports.configsModel = configs;
//# sourceMappingURL=configs.js.map