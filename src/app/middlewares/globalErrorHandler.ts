import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  //  eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  req: Request,
  res: Response,
  //  eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const statusCode = 500;
  const message = error.message || "something went wrong";
  res.status(statusCode).json({
    success: false,
    message: message,
    error: error,
  });
};

export default globalErrorHandler;
