import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../../config";
import { jwtHelper } from "../../helper/jwtHelper";


const login = async (payload: { email: string; password: string }) => {
    // console.log("Login payload:", payload); // Debugging test login in postman
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email,
        }
    })

    if (!user) {
        throw new Error("No account found with this email");
    }

    if (user.status !== UserStatus.ACTIVE) {
        throw new Error("Account is not active");
    }

    const isCorrectPassword = await bcrypt.compare(payload.password, user.password);
    if (!isCorrectPassword) {
        throw new Error("Password is incorrect");
    }

    // const refreshToken = jwt.sign({ email: user.email, role: user.role }, config.jwt_access_Token as string, { algorithm: "HS256", expiresIn: "90d" }) // without helper function


// with helper function
    const accessToken = jwtHelper.generateToken({ email: user.email, role: user.role }, config.jwt_access_Token as string, "1h")   

    const refreshToken = jwtHelper.generateToken({ email: user.email, role: user.role }, config.jwt_refresh_Token as string, "90d")

    
    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange,
    }

}

export const AuthService = {
    login
}