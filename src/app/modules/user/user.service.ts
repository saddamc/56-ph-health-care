
import bcrypt from "bcryptjs";
import { createPatientInput } from "./user.interface";

const createPatient = async (payload: createPatientInput) => {
    const hashPassword = await bcrypt.hash(payload.password, Number(process.env.JWT_SECRET));
}

export const UserService = {
    createPatient
}