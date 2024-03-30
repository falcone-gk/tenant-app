import { PrismaClient } from "@prisma/client"
import type { TenantData } from "~/types/admin"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

  const tenants = await prisma.tenant.findMany({
    orderBy: [{ id: 'asc' }],
    select: {
      id: true,
      name: true,
      createdAt: true,
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
  return createResponse<TenantData[]>(event, 'success', 200, tenants)
})
