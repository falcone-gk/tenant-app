import { Prisma, PrismaClient } from "@prisma/client"
import isAuthenticated from "~/server/permission/isAuthenticated"

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {
    const id = getRouterParams(event).id
    const payment = await prisma.payment.delete({
      where: {
        id: Number(id)
      },
      select: {
        roomId: true,
        serviceId: true,
        amount: true,
        amountPaid: true,
        tenantId: true,
        consume: true
      }
    })

    // update tenant debt (decrement)
    await prisma.tenant.update({
      where: {
        id: payment.tenantId
      },
      data: {
        debt: {
          decrement: new Prisma.Decimal(
            payment.amount.toNumber() - payment.amountPaid.toNumber()
          )
        }
      }
    })

    // update room consume (decrement)
    if (payment.consume && payment.consume > 0) {
      const updateRecord = {
        ...(payment.serviceId === 1) && {
          recordLight: {
            decrement: payment.consume
          }
        },
        ...(payment.serviceId === 2) && {
          recordWater: {
            decrement: payment.consume
          }
        }
      }

      await prisma.room.update({
        where: {
          id: payment.roomId
        },
        data: updateRecord
      })
    }

    return createResponse(event, 'success', 204)
  }
})
