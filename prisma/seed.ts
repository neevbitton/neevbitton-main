import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function run () {
    const user = await prisma.user.upsert({
        where: { email: 'admin@system.com'},
        update: {},
        create: {
            email: 'admin@system.com',
            hash: await bcrypt.hash(`${process.env.ADMIN_PASSWORD}`, 10),
            role: 'admin'
        }
    })
    
    console.log({ user })
}

run()
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
    .finally(async () => {
        prisma.$disconnect()
    })