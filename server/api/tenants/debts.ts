import { PrismaClient } from "@prisma/client"
import isAuthenticated from "~/server/permission/isAuthenticated"

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const debts = await prisma.payment.findMany({
      where: {
        isPaid: false
      },
      select: {
        id: true,
        tenant: {
          select: {
            id: true,
            name: true,
          }
        },
        service: {
          select: {
            id: true,
            name: true
          }
        },
        room: {
          select: {
            id: true,
            code: true
          }
        },
        amount: true,
        amountPaid: true,
        dateToPay: true
      }
    })

    const debtsResponse = debts.map((debt) => {
      return {
        ...debt,
        amount: debt.amount.toNumber(),
        amountPaid: debt.amountPaid.toNumber()
      }
    })

    return createResponse(event, 'success', 200, debtsResponse)
  }
})
