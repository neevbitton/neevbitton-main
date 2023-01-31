import { Request, Response, NextFunction } from "express";
import HttpException from '@/utils/exceptions/http.exception'
import { StatusCodes } from 'http-status-codes'

function ErrorMiddleware(
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR
    const message = error.message || 'Something went wrong, Please try again later'

    res.status(status).send({
        status,
        message
    })
}

export default ErrorMiddleware