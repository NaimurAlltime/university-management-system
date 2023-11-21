import express from "express";
import { StudentControllers } from "./student.controller";

const router = express.Router();

// call will controller function
router.post("/create-student", StudentControllers.createController);
router.get("/", StudentControllers.getAllStudents);
router.get("/:studentId", StudentControllers.getSingleStudent);

export const StudentRoutes = router;
