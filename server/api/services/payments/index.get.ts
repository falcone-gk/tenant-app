import { PrismaClient } from "@prisma/client"
import isAuthenticated from "~/server/permission/isAuthenticated"
import { paginationSchema } from "~/schemas"

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const queries = await getValidatedQuery(event, paginationSchema.parse)
    const limitInt = parseInt(queries.limit)
    const pageInt = parseInt(queries.page)

    const skip = (pageInt - 1) * limitInt
    const take = pageInt * limitInt

    const payments = await prisma.payment.findMany({
      orderBy: [{ id: 'asc' }],
      skip: skip,
      take: take,
      select: {
        id: true,
        tenantId: true,
        tenant: {
          select: {
            id: true,
            name: true
          }
        },
        roomId: true,
        room: {
          select: {
            id: true,
            code: true
          }
        },
        serviceId: true,
        service: {
          select: {
            id: true,
            name: true,
            unit: true
          }
        },
        amount: true,
        consume: true,
        dateToPay: true,
        paidMount: true,
        lastDatePaid: true,
        isPaid: true
      }
    })
    return createResponse(event, 'success', 200, payments)
  }
})
