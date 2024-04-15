import isAuthenticated from "~/server/permission/isAuthenticated"
import { pgClient } from "~/server/utils/prismaClient"

const prisma = pgClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const services = await prisma.service.findMany({
      orderBy: [{ id: 'asc' }],
      select: {
        id: true,
        name: true
      }
    })
    return createResponse(event, 'success', 200, services)
  }
})
