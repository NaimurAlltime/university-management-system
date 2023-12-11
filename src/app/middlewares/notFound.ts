import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const notFound = (
  req: Request,
  res: Response,
  //  eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const message = "Api Not Found!!";
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: message,
    error: "",
  });
};

export default notFound;
