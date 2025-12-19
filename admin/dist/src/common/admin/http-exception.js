"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpExceptionError /* extends Error */ {
    //error: string | null;
    constructor(statusCode, message, error) {
        //super(message);
        //this.statusCode = statusCode;
        this.status = statusCode;
        this.message = error || null;
        //this.error = error || null;
    }
}
exports.default = HttpExceptionError;
//# sourceMappingURL=http-exception.js.map