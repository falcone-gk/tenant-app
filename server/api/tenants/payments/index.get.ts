import { PrismaClient } from "@prisma/client"
import isAuthenticated from "~/server/permission/isAuthenticated"
import { paginationSchema } from "~/schemas"
import { paymentService } from "~/server/validators"

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
      select: paymentService
    })

    const paymentsResponse = payments.map((payment) => {
      return {
        ...payment,
        amount: payment.amount.toNumber(),
        amountPaid: payment.amountPaid.toNumber()
      }
    })

    return createResponse(event, 'success', 200, paymentsResponse)
  }
})
