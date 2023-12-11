import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

// application routes
app.use("/api/v1", router);

//testing
app.get("/", (req: Request, res: Response) => {
  // const a = 10;
  res.send("server in running");
});

// global error handler middleware
app.use(globalErrorHandler);

// Not found middleware
app.use(notFound);

export default app;
