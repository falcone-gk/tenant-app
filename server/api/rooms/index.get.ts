import { PrismaClient } from "@prisma/client"
import isAuthenticated from "~/server/permission/isAuthenticated"

const prisma = new PrismaClient()

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
        },
        recordLight: true,
        recordWater: true
      }
    })
    const customTenant = tenants.map((tenant) => {
      return {
        ...tenant,
        isAvailable: tenant.tenantId === null,
        recordLight: tenant.recordLight,
        recordWater: tenant.recordWater
      }
    })
    return createResponse(event, 'success', 200, customTenant)
  }
})