import { PrismaClient } from "@prisma/client"
import { RoomData } from "~/types/admin"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

  const tenants = await prisma.room.findMany({
    orderBy: [{ id: 'asc' }],
    select: {
      id: true,
      code: true,
      reference: true,
      floor: true,
      tenant: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
  return createResponse<RoomData[]>(event, 'success', 200, tenants)
})