import express from "express";
import { UserControllers } from "./user.controller";

const router = express.Router();

// call will controller function
router.post("/create-student", UserControllers.createController);

export const UserRoutes = router;
