"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = void 0;
const jwt = require('jsonwebtoken');
const config_1 = require("../../config");
const generateAccessToken = (id) => {
    const access_token = jwt.sign({ id }, config_1.config.token.access_token, { expiresIn: '30d' });
    return access_token;
};
exports.generateAccessToken = generateAccessToken;
//# sourceMappingURL=token.js.map