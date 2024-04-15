import { PrismaClient } from "@prisma/client"
import { queryServiceSchema } from "~/schemas"
import isAuthenticated from "~/server/permission/isAuthenticated"
import { totalPaymentService } from "~/server/validators"

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const queries = await getValidatedQuery(event, queryServiceSchema.parse)
    const serviceId = queries.serviceId ? queries.serviceId : undefined
    const startDate = queries.startDate ? new Date(queries.startDate) : undefined
    const endDate = queries.endDate ? new Date(queries.endDate) : undefined

    const whereClause = {
      isPaid: queries.isPaid,
      // OR returns empty when dates are undefined
      ...(queries.startDate || queries.endDate) && {
        OR: [
          { registerDate: { gte: startDate, lte: endDate } },
          { outageDate: { gte: startDate, lte: endDate } }
        ],
      },
      serviceId: serviceId,
    }

    const payments = await prisma.totalPayment.findMany({
      orderBy: [{ id: 'asc' }],
      where: whereClause,
      select: totalPaymentService
    })

    const paymentsRes = payments.map((payment) => {
      return {
        ...payment,
        amount: payment.amount.toNumber(),
        consume: payment.consume ? payment.consume.toNumber() : null
      }
    })

    return createResponse(event, 'success', 200, paymentsRes)
  }
})
