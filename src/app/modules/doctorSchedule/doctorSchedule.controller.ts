import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";


const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorScheduleService.insertIntoDB(req.body);
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Schedule created successfully",
        data: result
    })
});

export const DoctorScheduleController = {
    insertIntoDB
}