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
        amount: true,
        amountPaid: true,
        tenantId: true
      }
    })
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
    return createResponse(event, 'success', 204)
  }
})
