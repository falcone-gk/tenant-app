import { Prisma, PrismaClient } from '@prisma/client'
import { addPaySchema } from '~/schemas'
import isAuthenticated from '~/server/permission/isAuthenticated'
import { paymentService } from '~/server/validators'

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const id = getRouterParams(event).id
    const body = await readValidatedBody(event, addPaySchema.parse)
    const payment = await prisma.payment.update({
      where: {
        id: Number(id)
      },
      data: {
        amountPaid: {
          increment: new Prisma.Decimal(body.newPayment)
        },
        lastDatePaid: new Date(),
        isPaid: (body.newPayment + body.amountPaid) === body.amount
      },
      select: paymentService
    })

    await prisma.tenant.update({
      where: {
        id: payment.tenantId
      },
      data: {
        debt: {
          decrement: new Prisma.Decimal(body.newPayment)
        }
      }
    })
    return createResponse(event, 'success', 200, payment)
  }
})
