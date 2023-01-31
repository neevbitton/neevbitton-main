import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from "@/utils/exceptions/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import validation from '@/resources/auth/auth.validation'
import AuthService from "@/resources/auth/auth.service";
import { StatusCodes } from "http-status-codes";


class AuthController implements Controller {
    public path = '/auth'
    public router = Router()
    private authService = new AuthService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validation.register),
            this.register
        )

        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validation.login),
            this.login
        )
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password, firstName, lastName } = req.body

            const token = await this.authService.register(
                {
                    email,
                    password,
                    firstName,
                    lastName
                }
            )

            res.status(StatusCodes.CREATED).json({token})
        } catch (error: any) {
            next(error)
        }
    }

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body
            
            const token = await this.authService.login(
                email,
                password
            )

            res.status(StatusCodes.OK).json({ token })
        } catch (error: any) {
            next(error)
        }
    }
}

export default AuthController