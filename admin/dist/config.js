"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const config_yaml_1 = __importDefault(require("config-yaml"));
const config = (0, config_yaml_1.default)(`${__dirname}/src/config.yaml`);
exports.config = config;
//# sourceMappingURL=config.js.map