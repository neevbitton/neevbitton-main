import { PrismaClient } from "@prisma/client";
import User from "@/resources/user/user.interface";
import InternalServerException from "@/utils/exceptions/internal-server.exception";
import { Request } from "express";

class UserService {
    private prisma = new PrismaClient()

    /**
     * Get all users
     */
    public async getUsers(): Promise<User[] | Error> {
        try {
            const users: User[] = await this.prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true
                }
            })

            return users
        } catch (error) {
            throw new InternalServerException()
        }
    }

    /**
     * Update user
     */
    public async updateUser(req: Request): Promise<User | Error> {
        try {
            const user = await this.prisma.user.update({
                where: {
                  id: req.params.id,
                },
                data: req.body,
              });
              const { hash, ...payload} = user
              return payload    
        } catch (error) {
            throw new InternalServerException()
        }
    }

    /**
     * Delete user
     */
    public async deleteUser(id: string): Promise<string | Error> {
        try {
            await this.prisma.user.delete({
                where: {
                    id: id
                }
            })
            return `Successfully delete user ${id}`

        } catch (error) {
            throw new InternalServerException()
        }
    }

}

export default UserService