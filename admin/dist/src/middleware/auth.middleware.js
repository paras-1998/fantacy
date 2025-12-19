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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenHandler = exports.authHandler = void 0;
const http_exception_1 = __importDefault(require("../common/http-exception"));
const admins_service_1 = require("../services/admins.service");
const jwt = require('jsonwebtoken');
const config_1 = require("../../config");
const authHandler = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = request.headers.authorization; // Express headers are auto converted to lowercase
        if (token && token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
            if (token) {
                const tokenData = jwt.verify(token, config_1.config.token.access_token);
                const user = yield (0, admins_service_1.findOneById)(tokenData.id, "status lv");
                if (!user) {
                    throw new Error('NOT AUTHORIZED');
                }
                request.user = user;
                next();
            }
            else {
                throw new Error('Auth token is not supplied');
            }
        }
        else {
            throw new Error('Auth token is not supplied');
        }
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.authHandler = authHandler;
const tokenHandler = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = request.headers.authorization; // Express headers are auto converted to lowercase
        if (token && token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
            if (token) {
                const tokenData = jwt.verify(token, config_1.config.token.access_token);
                const user = yield (0, admins_service_1.findOneById)(tokenData.id, "status lv");
                if (!user) {
                    throw new Error('NOT AUTHORIZED');
                }
                request.user = user;
                next();
            }
            else {
                next();
            }
        }
        else {
            next();
        }
    }
    catch (err) {
        return next(new http_exception_1.default(400, 'no errorkk', err.message));
    }
});
exports.tokenHandler = tokenHandler;
//# sourceMappingURL=auth.middleware.js.map