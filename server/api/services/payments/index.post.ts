import { PrismaClient } from "@prisma/client"
import { totalPaymentSchema } from "~/schemas"
import isAuthenticated from "~/server/permission/isAuthenticated"

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {
    const body = await readValidatedBody(event, totalPaymentSchema.parse)
    const payment = await prisma.totalPayment.create({
      data: {
        serviceId: body.serviceId,
        amount: body.amount,
        consume: body.consume,
        outageDate: body.outageDate,
        registerDate: body.registerDate,
        isPaid: body.amount === body.consume ? true : false
      },
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
    return createResponse(event, 'success', 200, payment)
  }
})
