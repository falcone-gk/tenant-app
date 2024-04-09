import { PrismaClient } from "@prisma/client"
import { totalPaymentSchema } from "~/schemas";
import isAuthenticated from "~/server/permission/isAuthenticated";

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const id = getRouterParams(event).id
    const body = await readValidatedBody(event, totalPaymentSchema.parse)
    const payment = await prisma.totalPayment.update({
      where: { id: Number(id) },
      data: {
        serviceId: body.serviceId,
        amount: body.amount,
        consume: body.consume,
        outageDate: body.outageDate,
        registerDate: body.registerDate,
        isPaid: body.isPaid
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
