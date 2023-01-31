import token from "@/utils/token";
import { PrismaClient } from "@prisma/client";
import Auth from '@/resources/auth/auth.interface'
import bcrypt from 'bcrypt'
import NotFoundException from "@/utils/exceptions/not-found.exception";
import HttpException from "@/utils/exceptions/http.exception";
import { StatusCodes } from "http-status-codes";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import ForbiddenException from "@/utils/exceptions/forbidden.exception";

class AuthService {
    private prisma = new PrismaClient()

    /**
     * Register a new user
     */
    public async register(
        dto: Auth
    ): Promise<string | Error> {
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: await bcrypt.hash(dto.password, 10),
                    firstName: dto.firstName,
                    lastName: dto.lastName
                }
            })
            
            const accessToken = token.createToken(user.id)

            return accessToken
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2002'){
                    throw new ForbiddenException(
                        'Credentials Taken'
                    )
                }
            }
            throw error
        }
    }

    /**
     * Attempt to login user
     */
    public async login(
        email: string,
        password: string
    ): Promise<string | Error | HttpException> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: email
                }
            })

            if(!user) throw new NotFoundException(`Unable to find user with ${email}`)

            if(await this.passwordValidation(password, user.hash)) {
                return token.createToken(user.id)
            }
            else {
                throw new HttpException(
                    StatusCodes.BAD_REQUEST,
                    'Wrong credentials given'
                )
            }
        } catch (error) {
            throw error
        }
    }
    
    private passwordValidation = async function (
        password: string, hash: string | null
    ): Promise<Error | boolean> {
        return await bcrypt.compare(password, hash? hash : '')
    }

}

export default AuthService