import { StatusCodes } from "http-status-codes";
import HttpException from "./http.exception";

class NotFoundException extends HttpException {
    constructor(message: string) {
        super(StatusCodes.NOT_FOUND, message)
    }
}

export default NotFoundException
