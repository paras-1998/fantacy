import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => {

  console.log("request.originalUrl "+request.originalUrl);
  const message = "Resource not found";

  response.status(404).send({message,status: 404});
};