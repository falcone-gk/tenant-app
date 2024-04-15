import jwt from 'jsonwebtoken'
import { pgClient } from "~/server/utils/prismaClient"

const prisma = pgClient()

export default defineEventHandler(async (event) => {

    const config = useRuntimeConfig()
    const token = getCookie(event, 'token')

    if (!token) {
        throw createError({ status: 401, message: 'Unauthorized' })
    }

    const user = await prisma.user.findFirst({
        where: {
            token: token
        },
        select: {
            id: true,
            username: true,
            role: true
        }
    })

    if (!user) {
        throw createError({ status: 401, message: 'Unauthorized' })
    }

    const secretKey = config.public.jwtSecretKey as string
    try {
        jwt.verify(token, secretKey)
    } catch (e) {
        throw createError({ status: 401, message: 'Unauthorized' })
    }

    event.context.user = user
})
