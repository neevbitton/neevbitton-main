import { StatusCodes } from "http-status-codes";
import HttpException from "./http.exception";

class UnathorizedException extends HttpException {
    constructor(message: string) {
        super(StatusCodes.UNAUTHORIZED, message)
    }
}

export default UnathorizedException
