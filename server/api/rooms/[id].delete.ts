import { PrismaClient } from "@prisma/client"
import isAuthenticated from "~/server/permission/isAuthenticated"

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {
    const id = getRouterParams(event).id
    await prisma.room.delete({
      where: {
        id: Number(id)
      }
    })

    return createResponse(event, 'success', 204)
  }
})