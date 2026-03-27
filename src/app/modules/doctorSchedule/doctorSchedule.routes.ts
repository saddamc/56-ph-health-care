import express from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";

const router = express.Router();

router.post(
    "/",
    DoctorScheduleController.insertIntoDB
)

export const doctorScheduleRoutes = router;