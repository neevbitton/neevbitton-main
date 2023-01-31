import { Request, Response, NextFunction } from "express";
import token from "@/utils/token";
import Token from "@/utils/interfaces/token.interface";
import HttpException from "@/utils/exceptions/http.exception";
import UnathorizedException from "@/utils/exceptions/unauthorized.exception";
import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client";
import User from "@/resources/user/user.interface";
import InternalServerException from "@/utils/exceptions/internal-server.exception";
import ForbiddenException from "@/utils/exceptions/forbidden.exception";

const prisma = new PrismaClient()

export async function AuthenticatedMiddleware (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer = req.headers.authorization

    if(!bearer || !bearer?.startsWith('Bearer ')) {
        return next(new UnathorizedException("Unauthorized"))
    }

    const accessToken = bearer?.split('Bearer ')[1].trim();

    try {
        const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(
            accessToken ? accessToken : ''
        );

        if (payload instanceof jwt.JsonWebTokenError) {
            return next(new UnathorizedException("Unauthorised"));
        }

        const user: User | null = await prisma.user.findUnique({
            where: {
                id: payload.id
            }
        })

        if (!user) {
            return next(new UnathorizedException("Unauthorised"));
        }

        delete user.hash

        req.user = user;

        return next();
    } catch (error) {
        return next(new UnathorizedException("Unauthorised"));
    }

}


export async function AuthenticatedUserMiddleware (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    if(req.user.role === 'admin' || req.params.id === req.user.id) {
        return next()
    }
    else {
        return next(new ForbiddenException("Not allowed"))
    }
}


export async function AuthenticatedAdminMiddleware (
    req: Request,
    res: Response,
    next: NextFunction
) {
    if(req.user.role === 'admin') {
        return next()
    }
    else {
        return next(new ForbiddenException("Not allowed"))
    }
}

export default {
    AuthenticatedMiddleware,
    AuthenticatedUserMiddleware,
    AuthenticatedAdminMiddleware
}
