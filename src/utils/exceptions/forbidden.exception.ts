import { StatusCodes } from "http-status-codes";
import HttpException from "./http.exception";

class ForbiddenException extends HttpException {
    constructor(message: string) {
        super(StatusCodes.FORBIDDEN, message)
    }
}

export default ForbiddenException
