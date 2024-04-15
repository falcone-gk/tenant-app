import { Prisma } from "@prisma/client"
import { totalPaymentSchema } from "~/schemas";
import isAuthenticated from "~/server/permission/isAuthenticated";
import { totalPaymentService } from "~/server/validators";
import { pgClient } from "~/server/utils/prismaClient"

const prisma = pgClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const id = getRouterParams(event).id
    const body = await readValidatedBody(event, totalPaymentSchema.parse)
    const payment = await prisma.totalPayment.update({
      where: { id: Number(id) },
      data: {
        serviceId: body.serviceId,
        amount: new Prisma.Decimal(body.amount),
        consume: body.consume ? new Prisma.Decimal(body.consume) : null,
        outageDate: body.outageDate,
        registerDate: body.registerDate,
        isPaid: body.isPaid
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
