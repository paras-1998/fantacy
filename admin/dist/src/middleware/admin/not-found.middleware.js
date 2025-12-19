"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const notFoundHandler = (request, response, next) => {
    console.log("request.originalUrl " + request.originalUrl);
    const message = "Resource not found";
    response.status(404).send({ message, status: 404 });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=not-found.middleware.js.map