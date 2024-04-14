import { Prisma, PrismaClient } from "@prisma/client"
import { totalPaymentSchema } from "~/schemas"
import isAuthenticated from "~/server/permission/isAuthenticated"
import { totalPaymentService } from "~/server/validators"

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {
    const body = await readValidatedBody(event, totalPaymentSchema.parse)
    const payment = await prisma.totalPayment.create({
      data: {
        serviceId: body.serviceId,
        amount: new Prisma.Decimal(body.amount),
        consume: body.consume ? new Prisma.Decimal(body.consume) : null,
        outageDate: body.outageDate,
        registerDate: body.registerDate,
        isPaid: body.amount === body.consume ? true : false
      },
      select: totalPaymentService
    })

    const paymentRes = {
      ...payment,
      amount: payment.amount.toNumber(),
      consume: payment.consume ? payment.consume.toNumber() : null
    }

    return createResponse(event, 'success', 200, paymentRes)
  }
})
