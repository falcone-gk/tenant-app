import { PrismaClient } from "@prisma/client"
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

    const from = getRequestURL(event).pathname
    if (!from.startsWith('/api/auth/login') && from.startsWith('/api')) {
        const config = useRuntimeConfig()
        const userTokenHeader = getCookie(event, 'token')

        if (!userTokenHeader) {
            return createResponse(event, 'fail', 401, undefined, 'Unauthorized')
        }

        const token = userTokenHeader.split(' ')[1]
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
            return createResponse(event, 'fail', 401, undefined, 'Unauthorized')
        }

        const secretKey = config.public.jwtSecretKey as string
        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        token: ''
                    }
                })
                return createResponse(event, 'fail', 401, undefined, 'Unauthorized')
            }
        })

        event.context.user = user
    }
})
