import { PrismaClient } from "@prisma/client"
import isAuthenticated from "../permission/isAuthenticated"

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {
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
          }
        }
      }
    })

    const rooms = await prisma.room.findMany({
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

    const data = {
      tenants: tenants,
      rooms: rooms
    }

    return createResponse(event, 'success', 200, data)

  }
})
