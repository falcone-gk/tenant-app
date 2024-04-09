import { PrismaClient } from "@prisma/client"
import isAuthenticated from "~/server/permission/isAuthenticated"
import { paginationSchema } from "~/schemas"

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const queries = await getValidatedQuery(event, paginationSchema.parse)
    //const limitInt = parseInt(queries.limit)
    //const pageInt = parseInt(queries.page)
    // When no params are passed, the default values is zero so we need to set it to undefined
    const tenantId = queries.tenantId ? queries.tenantId : undefined
    const serviceId = queries.serviceId ? queries.serviceId : undefined
    const startDate = queries.startDate
    const endDate = queries.endDate

    //const skip = (pageInt - 1) * limitInt
    //const take = pageInt * limitInt

    const payments = await prisma.payment.findMany({
      orderBy: [{ id: 'asc' }],
      //skip: skip,
      //take: take,
      where: {
        OR: [
          { dateToPay: { gte: startDate, lte: endDate } },
          { lastDatePaid: { gte: startDate, lte: endDate } }
        ],
        tenantId: tenantId,
        serviceId: serviceId,
      },
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
