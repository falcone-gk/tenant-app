import { PrismaClient } from "@prisma/client"
import { Room } from "~/types"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

  const tenants = await prisma.room.findMany({
    orderBy: [{ id: 'asc' }]
  })
  return createResponse<Room[]>(event, 'success', 200, tenants)
})