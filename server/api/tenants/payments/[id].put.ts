import { PrismaClient, Prisma } from '@prisma/client'
import isAuthenticated from '~/server/permission/isAuthenticated'
import { paymentSchema } from '~/schemas'
import { paymentService } from '~/server/validators'

const prisma = new PrismaClient()

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
        consume: true
      }
    })

    // update tenant total debt
    const newPayment = await prisma.payment.update({
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

    // update tenant debt only if amount changed
    if (body.amount !== currentPayment.amount.toNumber()) {
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
    }

    // Update room light or water total consume
    if ((body.serviceId === 1 || body.serviceId === 2) && body.consume) {
      const updateRecord = {
        ...(body.serviceId === 1) && {
          recordLight: {
            increment: body.consume - (currentPayment.consume || 0)
          }
        },
        ...(body.serviceId === 2) && {
          recordWater: {
            increment: body.consume - (currentPayment.consume || 0)
          }
        }
      }
      await prisma.room.update({
        where: {
          id: body.roomId
        },
        data: updateRecord
      })
    }

    return createResponse(event, 'success', 200, newPayment)
  }
})