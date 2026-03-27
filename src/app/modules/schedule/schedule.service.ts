import { Prisma } from '@prisma/client';
import { IOptions, paginationHelper } from '../../helper/paginationHelper';
import { prisma } from '../../shared/prisma';
import { addMinutes, addHours, format } from "date-fns";
import { date } from 'zod';
import { IJWTPayload } from '../../types/common';


const insertIntoDB = async (payload: any) => {
    // console.log({payload});
    const { startTime, endTime, startDate, endDate } = payload;
    // console.log({startDate, endDate, startTime, endTime});
    const intervalTime = 30; // in minutes

    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
               addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(startTime.split(":")[0])  // 11:00
                ),
                Number(startTime.split(":")[1])
           )
        )

        const endDateTime = new Date(
            addMinutes(
               addHours(
                    `${format(lastDate, "yyyy-MM-dd")}`,
                    Number(endTime.split(":")[0])  // 11:00
                ),
                Number(endTime.split(":")[1])
           )
        )

        // console.log({startDateTime, endDateTime});

        while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime; // 10:00
            const slotEndDateTime = addMinutes(startDateTime, intervalTime);  // 10:30

            const scheduleDate = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime
            }

            // console.log({scheduleDate});

            const existingSchedule = await prisma.schedule.findFirst({
                where: scheduleDate
            })

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleDate
                });
                schedules.push(result);
            }
            
            slotStartDateTime.setMinutes(slotStartDateTime.getMinutes() + intervalTime)

        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return schedules;
}

const schedulesForDoctor = async (user: IJWTPayload, filters: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { startDateTime: filterStartDateTime, endDateTime: filterEndDateTime } = filters;

    const andConditions: Prisma.ScheduleWhereInput[] = [];

    if (filterStartDateTime && filterEndDateTime) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: filterStartDateTime
                    }
                },
                {
                    endDateTime: {
                        lte: filterEndDateTime
                    }
                }
            ]
        })
    }

    const whereConditions: Prisma.ScheduleWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    // 1st find doctor schedules
    const doctorSchedules = await prisma.doctorSchedule.findMany({
        where: {
            doctor: {
                email: user.email
            }
        },
        select: {
            scheduleId: true
        }
    })
    // console.log(doctorSchedules);

    // 2nd all id map for doctor schedules
    const doctorScheduleIds = doctorSchedules.map(schedule => schedule.scheduleId);

    // We want which Id add in doctor Schedule , this id don't show in available schedule for doctor
    const result = await prisma.schedule.findMany({
             // where: whereConditions  
         where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.schedule.count({
        // where: whereConditions
         where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        }
    });

    return {
        meta: {
            page, 
            limit,
            total
        },
        data: result
    }

}

const deleteScheduleFromDB = async (id: string) => {
    return await prisma.schedule.delete({
        where: {
            id
        }
    })
}


export const ScheduleService = {
    insertIntoDB,
    schedulesForDoctor,
    deleteScheduleFromDB
}