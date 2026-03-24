
import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";
import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import config from "../../../config";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";
import { userSearchableFields } from "./user.constant";

const createPatient = async (req: Request) => {

    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file)
        // console.log({uploadResult});
        req.body.patient.profilePhoto=uploadResult?.secure_url;
    }

    const hashPassword = await bcrypt.hash(req.body.password, Number(config.password_hash));
    

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: req.body.patient.email,
                password: hashPassword,
            }
        });
        return await tnx.patient.create({
            data: req.body.patient
        })
    })
    return result;
}

// const getAllFromDB = async ({ page, limit, searchTerm, sortBy, sortOrder, role, status }: { page: number, limit: number, searchTerm?: any, sortBy: any, sortOrder: any, role: any, status: any }) => { // => OLD Way
// console.log({ page, limit });
    
    // const pageNumber = page || 1;
    // const limitNumber = limit || 10;
    // const skip = (pageNumber - 1) * limitNumber;

    
const getAllFromDB = async (params: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;
    
    const andConditions: Prisma.UserWhereInput[] = [];
    
    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
            [field]: {
                contains: searchTerm,
                mode: "insensitive"
            }
        }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key],
                }
            }))
        });
    }

    // console.log(andConditions)

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
     } : {};



    const result = await prisma.user.findMany({
        skip,
        take: limit,

        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        } 
    });
    const total = await prisma.user.count({
        where: whereConditions
    })
    return {
        meta: {
            page, 
            limit, 
            total
        },
        data: result
    };
}

export const UserService = {
    createPatient,
    getAllFromDB
}