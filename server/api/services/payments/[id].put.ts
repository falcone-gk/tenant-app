import { PrismaClient } from '@prisma/client'
import isAuthenticated from '~/server/permission/isAuthenticated'
import { paymentSchema } from '~/schemas'

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const id = getRouterParams(event).id
    const body = await readValidatedBody(event, paymentSchema.parse)
    const payment = await prisma.payment.update({
      where: {
        id: Number(id)
      },
      data: {
        tenantId: body.tenantId,
        roomId: body.roomId,
        serviceId: body.serviceId,
        amount: body.amount,
        consume: body.consume,
        dateToPay: body.dateToPay,
        paidMount: body.paidMount,
        isPaid: body.amount === body.paidMount ? true : false
      },
      select: {
        id: true,
        tenantId: true,
        tenant: {
          select: {
            id: true,
            name: true
          }
        },
        roomId: true,
        room: {
          select: {
            id: true,
            code: true
          }
        },
        serviceId: true,
        service: {
          select: {
            id: true,
            name: true,
            unit: true
          }
        },
        amount: true,
        consume: true,
        dateToPay: true,
        paidMount: true,
        lastDatePaid: true,
        isPaid: true
      }
    })
    return createResponse(event, 'success', 200, payment)
  }
})