import { PrismaClient, Prisma } from '@prisma/client'
import isAuthenticated from '~/server/permission/isAuthenticated'
import { paymentSchema } from '~/schemas'
import { paymentService } from '~/server/validators'

const prisma = new PrismaClient()

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
        paidMount: new Prisma.Decimal(body.paidMount),
        isPaid: body.amount === body.paidMount ? true : false
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
