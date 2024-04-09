import { PrismaClient } from "@prisma/client"
import isAuthenticated from "~/server/permission/isAuthenticated"

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const payments = await prisma.totalPayment.findMany({
      orderBy: [{ id: 'asc' }],
      select: {
        id: true,
        amount: true,
        consume: true,
        registerDate: true,
        isPaid: true,
        serviceId: true,
        service: {
          select: {
            id: true,
            name: true,
            unit: true
          }
        },
        outageDate: true
      }
    })

    return createResponse(event, 'success', 200, payments)
  }
})
