
import bcrypt from "bcryptjs";
import { createPatientInput } from "./user.interface";
import { prisma } from "../../shared/prisma";

const createPatient = async (payload: createPatientInput) => {
    const hashPassword = await bcrypt.hash(payload.password, 10);
    // const hashPassword = await bcrypt.hash(payload.password, Number(process.env.JWT_SECRET));

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: payload.email,
                password: hashPassword,
                // name: payload.name,
            }
        });
        return await tnx.patient.create({
            data: {
                name: payload.name,
                email: payload.email,
            } 
        })
    })
    return result;
}

export const UserService = {
    createPatient
}