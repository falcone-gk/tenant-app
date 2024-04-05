import { PrismaClient } from "@prisma/client"
import isAuthenticated from "~/server/permission/isAuthenticated"

const prisma = new PrismaClient()

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
