import express from "express";
import { DoctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.get(
    "/",
    DoctorController.getAllFromDB
)

router.patch(
    "/:id",
    // auth(UserRole.ADMIN, UserRole.DOCTOR),
    DoctorController.updateIntoDB
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN),
    DoctorController.deleteFromDB
);


router.get('/:id', DoctorController.getByIdFromDB);

router.delete(
    '/soft/:id',
    auth(UserRole.ADMIN),
    DoctorController.softDelete);
    
    // 60-02
router.post("/suggestion", DoctorController.getAISuggestions);
    

export const DoctorRoutes = router;