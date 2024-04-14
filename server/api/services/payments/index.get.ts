import { PrismaClient } from "@prisma/client"
import isAuthenticated from "~/server/permission/isAuthenticated"
import { totalPaymentService } from "~/server/validators"

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const payments = await prisma.totalPayment.findMany({
      orderBy: [{ id: 'asc' }],
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
