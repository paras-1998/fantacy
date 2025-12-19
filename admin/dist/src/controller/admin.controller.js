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
exports.deleteMany = exports.deleteOne = exports.update = exports.getOne = exports.create = exports.list = exports.authenticate = void 0;
const assert = require("assert");
const mongoose_1 = __importDefault(require("mongoose"));
const http_exception_1 = __importDefault(require("../common/admin/http-exception"));
const adminsServices = __importStar(require("../services/admins.service"));
const { generateHash, compareData } = require('../common/bcrypt');
const { generateAccessToken } = require('../common/token');
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        assert(req.body.email, "Email is required");
        assert(req.body.password, "password is required");
        let data = req.body;
        /* data.email = String(data.email);
        data.password = String(data.password); */
        const regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let validEmail = regx.test(String(data.email.toString()));
        if (!validEmail) {
            throw new Error('Invalid email.');
        }
        let admin = yield adminsServices.findOneByEmail(data.email, "password name");
        if (!admin) {
            throw new Error('User not found.');
        }
        //Authorization process
        const isMatch = yield compareData(data.password, admin.password);
        if (!isMatch) {
            throw new Error('Incorrect password.');
        }
        const auth = yield generateAccessToken(admin._id);
        admin.id = admin._id;
        res.status(200).send({
            success: true,
            message: "Login successfully.",
            data: admin,
            auth
        });
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.authenticate = authenticate;
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let page = Number(req.query.page);
        let perPage = Number(req.query.perPage);
        let data = yield adminsServices.list({}, page, perPage);
        let count = yield adminsServices.countDoc({});
        return res.status(200).send({
            success: true,
            message: "Admin.",
            data,
            count
        });
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.list = list;
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        assert(req.body.name, "name is required");
        assert(req.body.email, "email is required");
        assert(req.body.password, "password is required");
        let adminData = req.body;
        const regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let validEmail = regx.test(String(adminData.email));
        if (!validEmail) {
            throw new Error('Invalid email.');
        }
        if (yield adminsServices.duplicateEmailValidation(adminData.email)) {
            throw new Error('Email is already registered.');
        }
        adminData.password = yield generateHash(adminData.password);
        let data = yield adminsServices.create(adminData);
        adminData["id"] = data._id;
        return res.status(200).send({
            success: true,
            message: "Saved successfully.",
            data: adminData
        });
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.create = create;
const getOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let data = yield adminsServices.findOneById(id, "name email");
        data.id = data._id;
        return res.status(200).send({
            success: true,
            message: "Admin.",
            data,
        });
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.getOne = getOne;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        assert(req.body.name, "name is required");
        assert(req.body.email, "email is required");
        let adminData = req.body;
        if (adminData === null || adminData === void 0 ? void 0 : adminData.password) {
            adminData.password = yield generateHash(adminData.password);
        }
        let data = yield adminsServices.findNupdateOneById(id, adminData);
        data.id = data._id;
        return res.status(200).send({
            success: true,
            message: "Admin.",
            data,
        });
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.update = update;
const deleteOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield adminsServices.deleteOneById(id);
        return res.status(200).send({
            success: true,
            message: "Group session deleted.",
        });
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.deleteOne = deleteOne;
const deleteMany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let filter = JSON.parse(req.query.filter.toString());
        if (filter.id) {
            let _ids = [];
            for (let id of filter.id) {
                _ids.push(new mongoose_1.default.Types.ObjectId(id));
            }
            yield adminsServices.deleteManyById(_ids);
        }
        return res.status(200).send({
            success: true,
            message: "deleted.",
            data: filter.id,
        });
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.deleteMany = deleteMany;
//# sourceMappingURL=admin.controller.js.map