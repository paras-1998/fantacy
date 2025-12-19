"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpExceptionError extends Error {
    constructor(statusCode, message, error) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.error = error || null;
    }
}
exports.default = HttpExceptionError;
//# sourceMappingURL=http-exception.js.map