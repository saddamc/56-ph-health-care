import express from 'express';
import { userRoutes } from '../modules/user/user.routes';


const router = express.Router();

const moduleRoutes = [
    // {
    //     path: '/',
    //     route: router
    // },
    // 57-01 Start
    {
        path: '/user',
        route: userRoutes
    }
    // 57-01 End
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;