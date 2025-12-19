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
exports.compareData = exports.generateHash = void 0;
const bcryptData = require("bcryptjs");
var bcrypt = {};
const generateHash = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //var salt = await bcryptData.genSalt(10);
        var hash = yield bcryptData.hash(data.toString(), 10);
        return hash;
    }
    catch (e) {
        throw (e);
    }
});
exports.generateHash = generateHash;
const compareData = (userInput, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var isMatch = bcryptData.compare(userInput, data);
        return isMatch;
    }
    catch (e) {
        throw (e);
    }
});
exports.compareData = compareData;
//# sourceMappingURL=bcrypt.js.map