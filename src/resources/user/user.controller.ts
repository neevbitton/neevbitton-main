import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from "@/utils/exceptions/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import validation from "@/resources/user/user.validation"
import UserService from "./user.service";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedAdminMiddleware, AuthenticatedMiddleware, AuthenticatedUserMiddleware } from "@/middleware/authenticated.middleware";
import NotFoundException from "@/utils/exceptions/not-found.exception";

class UserController implements Controller {
    public path = '/users'
    public router = Router()
    private userService = new UserService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get(
            `${this.path}`,
            AuthenticatedMiddleware,
            AuthenticatedAdminMiddleware,
            this.getUsers
        )

        this.router.get(
            `${this.path}/me`,
            AuthenticatedMiddleware,
            this.getMe
        )

        this.router.patch(
            `${this.path}/:id`,
            AuthenticatedMiddleware,
            AuthenticatedUserMiddleware,
            validationMiddleware(validation.update),
            this.updateUser
        )

        this.router.delete(
            `${this.path}/:id`,
            AuthenticatedMiddleware,
            AuthenticatedUserMiddleware,
            this.deleteUser
        )
    }

    private getUsers = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            
            const users = await this.userService.getUsers()

            res.status(StatusCodes.OK).json(users)

        } catch (error: any) {
            next(error)
        }
    }

    private getMe = (
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        if(!req.user) {
            return next(new NotFoundException("No logged in user"))
        }

        res.status(200).json(req.user)
    }

    private updateUser = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const user = await this.userService.updateUser(req)

            res.status(StatusCodes.OK).json(user)
        } catch (error) {
            next(error)
        }
    }

    private deleteUser = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const msg = await this.userService.deleteUser(req.params.id)

            res.status(StatusCodes.OK).json(msg)
        } catch (error) {
            next(error)
        }
    }

}

export default UserController