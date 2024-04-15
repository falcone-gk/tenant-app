import { RoomData } from "~/types/admin"
import isAuthenticated from "~/server/permission/isAuthenticated"
import { pgClient } from "~/server/utils/prismaClient"

const prisma = pgClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {

    const tenants = await prisma.room.findMany({
      orderBy: [{ id: 'asc' }],
      select: {
        id: true,
        code: true,
        reference: true,
        floor: true,
        tenantId: true,
        tenant: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
    const customTenant = tenants.map((tenant) => {
      return {
        ...tenant,
        isAvailable: tenant.tenantId === null
      }
    })
    return createResponse<RoomData[]>(event, 'success', 200, customTenant)
  }
})