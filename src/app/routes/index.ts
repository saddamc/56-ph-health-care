import express from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { scheduleRoutes } from '../modules/schedule/schedule.routes';
import { doctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.routes';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.routes';


const router = express.Router();

const moduleRoutes = [
    // 57-01 Start
    {
        path: '/user',
        route: userRoutes
    },
    // 57-01 End
    // 57-08 Start
    {
        path: '/auth',
        route: authRoutes
    },
    // 57-08 End

    {
        path: '/schedule',
        route: scheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorScheduleRoutes
    },
    {
        path: '/specialties',
        route: SpecialtiesRoutes
    },
    // {
    //     path: '/doctor',
    //     route: DoctorRoutes
    // },
    // {
    //     path: '/admin',
    //     route: AdminRoutes
    // },
    // {
    //     path: '/patient',
    //     route: PatientRoutes
    // },
    // {
    //     path: '/appointment',
    //     route: AppointmentRoutes
    // },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;