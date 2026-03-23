import express from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';


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
    }
    // 57-08 End
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;