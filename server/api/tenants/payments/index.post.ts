import { Prisma } from '@prisma/client'
import isAuthenticated from '~/server/permission/isAuthenticated'
import { paymentSchema } from '~/schemas'
import { paymentService } from '~/server/validators'
import { pgClient } from "~/server/utils/prismaClient"

const prisma = pgClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const body = await readValidatedBody(event, paymentSchema.parse)
    const payment = await prisma.payment.create({
      data: {
        tenantId: body.tenantId,
        roomId: body.roomId,
        serviceId: body.serviceId,
        amount: new Prisma.Decimal(body.amount),
        consume: body.consume,
        dateToPay: body.dateToPay,
        amountPaid: new Prisma.Decimal(body.amountPaid),
        isPaid: body.amount === body.amountPaid ? true : false
      },
      select: paymentService
    })

    await prisma.tenant.update({
      where: {
        id: body.tenantId
      },
      data: {
        debt: {
          increment: new Prisma.Decimal(body.amount)
        }
      }
    })
    return createResponse(event, 'success', 200, payment)
  }
})
