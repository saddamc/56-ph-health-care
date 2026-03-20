import { create } from 'domain';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from './user.service';

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createPatient(req.body); //57-02
    console.log(result);
})

export const UserController = {
    createPatient
}