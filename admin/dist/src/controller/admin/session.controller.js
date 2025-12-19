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
exports.deleteOne = exports.deleteMany = exports.update = exports.create = exports.getOne = exports.timeslots = exports.list = void 0;
const moment_1 = __importDefault(require("moment"));
const assert = require("assert");
const http_exception_1 = __importDefault(require("../../common/admin/http-exception"));
const sessionsServices = __importStar(require("../../services/admin/sessions.service"));
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        let filter = JSON.parse(req.query.filter.toString());
        let filterQuery = filter;
        console.log("filterQuery ", filterQuery);
        if (filter.q) {
            query["$or"] = [
                { "winner": new RegExp(filter.q, "i") },
                { "winnerType": new RegExp(filter.q, "i") }
            ];
            delete filterQuery["q"];
        }
        if (filterQuery) {
            query = Object.assign(Object.assign({}, filterQuery), query);
        }
        let page = (req.query.page) ? Number(req.query.page) : 1;
        let perPage = (req.query.perPage) ? Number(req.query.perPage) : 10;
        let data = yield sessionsServices.list(query, page, perPage);
        let count = yield sessionsServices.countDoc(query);
        return res.status(200).send({
            success: true,
            message: "Sessions.",
            data,
            count
        });
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.list = list;
const timeslots = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = (0, moment_1.default)().utcOffset("+05:30");
        const minutesB = Math.floor(now.minutes() / 5) * 5; // Align to the nearest 5-minute interval
        let startB = now.clone().startOf('hour').add(minutesB, 'minutes');
        let data = [];
        for (let index = 0; index < 288; index++) {
            startB = startB.add(5, 'minutes');
            data.push({ id: startB.toString() });
        }
        return res.status(200).send({
            success: true,
            message: "Sessions.",
            data,
            //count
        });
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.timeslots = timeslots;
const getOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let data = yield sessionsServices.findOneById(id, "");
        data["id"] = data._id;
        return res.status(200).send({
            success: true,
            message: "Session.",
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
        assert(req.body.startTime, "startTime is required");
        assert(req.body.winnerType, "winnerType is required");
        assert(req.body.winner, "winner is required");
        let userData = req.body;
        const start = (0, moment_1.default)(userData.startTime).utcOffset("+05:30");
        const end = start.clone().add(5, 'minutes');
        userData.startTime = start;
        userData.endTime = end;
        let data = yield sessionsServices.create(userData);
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
        let data = yield sessionsServices.findNupdateOneById(id, userData);
        data["id"] = data._id;
        return res.status(200).send({
            success: true,
            message: "Sessions.",
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
            let sessions = yield sessionsServices.findManyById(filter.id, "totalQty");
            for (let session of sessions) {
                if (session.totalQty == 0) {
                    yield sessionsServices.deleteSession(session._id);
                }
            }
        }
        return res.status(200).send({
            success: true,
            message: "session deleted.",
            data: filter.id,
        });
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.deleteMany = deleteMany;
const deleteOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield sessionsServices.deleteSession(id);
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
//# sourceMappingURL=session.controller.js.map