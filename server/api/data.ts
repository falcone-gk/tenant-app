import { PrismaClient } from "@prisma/client"

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
          code: true,
        }
      }
    }
  })

  const rooms = await prisma.room.findMany({
    orderBy: [{ id: 'asc' }]
  })

  const data = {
    tenants: tenants,
    rooms: rooms
  }

  return createResponse(event, 'success', 200, data)

})
