import { NextFunction, Request, Response } from "express"
import config from "../../config";
import httpStatus  from 'http-status';
import ApiError from "../errors/ApiError";
import { Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../helpers/jwtHelpers";

const auth = (...roles: string[]) => {
    return async (req: Request & {user?: any}, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.accessToken;

            if (!token) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
            }

            const verifyUser = jwtHelpers.verifyToken(token, config.jwt.jwt_secret as Secret);

            req.user = verifyUser;

            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
            }

            next();
        } catch (err) {
            next(err);
        }
    }
}

export default auth;