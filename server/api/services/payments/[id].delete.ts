import isAuthenticated from "~/server/permission/isAuthenticated";
import { pgClient } from "~/server/utils/prismaClient"

const prisma = pgClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {
    const id = getRouterParams(event).id
    await prisma.totalPayment.delete({
      where: {
        id: Number(id)
      }
    })
    return createResponse(event, 'success', 204)
  }
})
