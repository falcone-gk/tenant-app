import type { TenantData } from "~/types/admin"
import isAuthenticated from "~/server/permission/isAuthenticated"
import { pgClient } from "~/server/utils/prismaClient"

const prisma = pgClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const tenants = await prisma.tenant.findMany({
      orderBy: [{ id: 'asc' }],
      select: {
        id: true,
        name: true,
        dayToPay: true,
        joinDate: true,
        debt: true,
        rooms: {
          select: {
            id: true,
            code: true,
            reference: true,
            floor: true
          }
        }
      }
    })

    const tenantResponse = tenants.map((tenant) => {
      return {
        ...tenant,
        debt: tenant.debt.toNumber()
      }
    })

    return createResponse<TenantData[]>(event, 'success', 200, tenantResponse)
  }
})
