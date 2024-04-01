import { roomSchema } from "~/schemas"
import { PrismaClient } from "@prisma/client"
import { RoomData } from "~/types/admin"
import isAuthenticated from "~/server/permission/isAuthenticated"

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {
    const body = await readValidatedBody(event, roomSchema.parse)

    const room = await prisma.room.create({
      data: {
        code: body.code,
        reference: body.reference,
        floor: body.floor,
        tenantId: body.tenantId
      },
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

    return createResponse<RoomData>(event, 'success', 200, room)
  }
})
