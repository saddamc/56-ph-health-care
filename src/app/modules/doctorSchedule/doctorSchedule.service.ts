import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../../types/common";

const insertIntoDB = async (user: IJWTPayload, payload: {
    scheduleIds: string[]
}) => {
    // console.log({ user, payload });
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    const doctorScheduleData = payload.scheduleIds.map(schedulerId => ({
        doctorId: doctorData.id,
        scheduleId: schedulerId
    }))
    // console.log( doctorScheduleData)
    // return {user, payload};

    // create many doctor schedule
    return await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    });    
}

export const DoctorScheduleService = {
    insertIntoDB
}