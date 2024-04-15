import { Prisma } from '@prisma/client'
import isAuthenticated from '~/server/permission/isAuthenticated'
import { paymentSchema } from '~/schemas'
import { paymentService } from '~/server/validators'
import { pgClient } from "~/server/utils/prismaClient"

const prisma = pgClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const id = getRouterParams(event).id
    const body = await readValidatedBody(event, paymentSchema.parse)
    const currentPayment = await prisma.payment.findUniqueOrThrow({
      where: {
        id: Number(id)
      },
      select: {
        amount: true,
      }
    })

    const payment = await prisma.payment.update({
      where: {
        id: Number(id)
      },
      data: {
        tenantId: body.tenantId,
        roomId: body.roomId,
        serviceId: body.serviceId,
        amount: new Prisma.Decimal(body.amount),
        consume: body.consume,
        dateToPay: body.dateToPay,
      },
      select: paymentService
    })

    await prisma.tenant.update({
      where: {
        id: body.tenantId
      },
      data: {
        debt: {
          increment: new Prisma.Decimal(
            body.amount - currentPayment.amount.toNumber()
          )
        }
      }
    })

    return createResponse(event, 'success', 200, payment)
  }
})