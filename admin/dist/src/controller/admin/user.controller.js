"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMany = exports.update = exports.create = exports.getOne = exports.list = void 0;
const assert = require("assert");
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_exception_1 = __importDefault(require("../../common/admin/http-exception"));
const userServices = __importStar(require("../../services/admin/users.service"));
const transactionServices = __importStar(require("../../services/admin/transactions.service"));
const balancehistoryServices = __importStar(require("../../services/admin/balancehistory.service"));
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        let filter = JSON.parse(req.query.filter.toString());
        let filterQuery = filter;
        console.log("filterQuery ", filterQuery);
        if (filter.id) {
            let _ids = [];
            for (let id of filter.id) {
                _ids.push(new mongoose_1.default.Types.ObjectId(id));
            }
            if (_ids.length > 0) {
                query["_id"] = { $in: _ids };
            }
        }
        if (filter.q) {
            console.log("|filter.q " + filter.q);
            query["$or"] = [
                { "userName": new RegExp(filter.q, "i") },
            ];
            delete filterQuery["q"];
        }
        if (filterQuery) {
            query = Object.assign(Object.assign({}, filterQuery), query);
        }
        let page = (req.query.page) ? Number(req.query.page) : 1;
        let perPage = (req.query.perPage) ? Number(req.query.perPage) : 10;
        let data = yield userServices.list(query, page, perPage);
        let count = yield userServices.countDoc(query);
        return res.status(200).send({
            success: true,
            message: "Users.",
            data,
            count
        });
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.list = list;
const getOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let data = yield userServices.findOneById(id, "_id username email status");
        data["id"] = data._id;
        return res.status(200).send({
            success: true,
            message: "User.",
            data,
        });
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.getOne = getOne;
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        assert(req.body.username, "username is required");
        assert(req.body.password, "password is required");
        let userData = req.body;
        if (yield userServices.duplicateusernameValidation(userData.username)) {
            throw new Error('User is already registered.');
        }
        let data = yield userServices.create(userData);
        userData["id"] = data._id;
        return res.status(200).send({
            success: true,
            message: "Saved successfully.",
            data: userData
        });
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.create = create;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let userData = req.body;
        let Olddata = yield userServices.findOneById(id, "balance");
        let amount = 0;
        if (userData.balance) {
            amount = userData.balance;
            delete userData.balance;
        }
        let newDt = { $set: userData };
        if (userData["balanceType"] !== "None" && amount > 0) {
            if (userData["balanceType"] == "Add") {
                newDt["$inc"] = { "balance": amount };
            }
            else if (userData["balanceType"] == "Remove") {
                newDt["$inc"] = { "balance": -amount };
            }
        }
        let data = yield userServices.findNupdateOneById(id, newDt);
        const todayDT = (0, moment_1.default)().utcOffset("+05:30").format('DD-MM-YYYY');
        let todayTransactions = yield transactionServices.findTransactionTheDay(id, todayDT);
        if (userData["balanceType"] !== "None" && amount > 0) {
            if (userData["balanceType"] == "Add") {
                if (todayTransactions) {
                    yield transactionServices.findNupdateOneById(todayTransactions._id, {
                        $set: {
                            cb: data.balance
                        },
                        $inc: {
                            ar: amount
                        }
                    });
                }
                else {
                    yield transactionServices.create({
                        dt: todayDT,
                        user: id,
                        ob: Olddata.balance,
                        ar: amount,
                        cb: data.balance
                    });
                }
                yield balancehistoryServices.create({ admin: req.user._id, user: id, amount: amount });
            }
            else if (userData["balanceType"] == "Remove") {
                if (todayTransactions) {
                    yield transactionServices.findNupdateOneById(todayTransactions._id, {
                        $set: {
                            cb: data.balance
                        },
                        $inc: {
                            aPay: amount
                        }
                    });
                }
                else {
                    yield transactionServices.create({
                        dt: todayDT,
                        user: id,
                        ob: Olddata.balance,
                        aPay: amount,
                        cb: data.balance
                    });
                }
                yield balancehistoryServices.create({ admin: req.user._id, user: id, amount: -amount });
            }
        }
        /* if(Olddata.balance !== data.balance){
            
            if(Olddata.balance > data.balance ){
                let deductedAmt = (Olddata.balance - data.balance);
                // balance is removed
                if(todayTransactions){
                    await transactionServices.findNupdateOneById(todayTransactions._id,{
                        $set:{
                            cb :data.balance
                        },
                        $inc : {
                            ar : -deductedAmt
                        }
                    });
                }
                else{
                    await transactionServices.create({
                        dt:todayDT,
                        user:id,

                        ob: Olddata.balance,
                        ar : -deductedAmt,
                        cb :data.balance
                    });
                }

            }
            else if(Olddata.balance < data.balance){
                let addedAmt = (  data.balance -Olddata.balance);
                // balance added
                if(todayTransactions){
                    await transactionServices.findNupdateOneById(todayTransactions._id,{
                        $set:{
                            cb :data.balance
                        },
                        $inc : {
                            ar : addedAmt
                        }
                    });
                }
                else{
                    await transactionServices.create({
                        dt:todayDT,
                        user:id,

                        ob: Olddata.balance,
                        ar : addedAmt,
                        cb :data.balance
                    });
                }
            }
        } */
        data["id"] = data._id;
        return res.status(200).send({
            success: true,
            message: "Users.",
            data,
        });
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.update = update;
const deleteMany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let filter = JSON.parse(req.query.filter.toString());
        if (filter.id) {
            let users = yield userServices.findManyById(filter.id, "pp");
            for (let user of users) {
                //user.pp
                //user._id
                yield userServices.deleteUser(user._id);
            }
        }
        return res.status(200).send({
            success: true,
            message: "User deleted.",
            data: filter.id,
        });
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.deleteMany = deleteMany;
//# sourceMappingURL=user.controller.js.map