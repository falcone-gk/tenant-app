import { PrismaClient } from "@prisma/client"
import { paginationSchema } from "~/schemas"
import isAuthenticated from "~/server/permission/isAuthenticated"
import { totalPaymentService } from "~/server/validators"

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const queries = await getValidatedQuery(event, paginationSchema.parse)
    const serviceId = queries.serviceId ? queries.serviceId : undefined
    const startDate = new Date(
      queries.startDate.getFullYear(), queries.startDate.getMonth(), 1
    )
    const endDate = new Date(
      queries.endDate.getFullYear(), queries.endDate.getMonth() + 1, 0
    )

    const payments = await prisma.totalPayment.findMany({
      orderBy: [{ id: 'asc' }],
      where: {
        isPaid: queries.isPaid,
        OR: [
          { registerDate: { gte: startDate, lte: endDate } },
          { outageDate: { gte: queries.startDate, lte: queries.endDate } }
        ],
        serviceId: serviceId,
      },
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
