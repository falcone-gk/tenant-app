import { roomSchema } from "~/schemas"
import { PrismaClient } from "@prisma/client"
import isAuthenticated from "~/server/permission/isAuthenticated"
import { RoomSelect } from "~/server/validators"

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
        tenantId: body.tenantId,
        recordLight: body.recordLight,
        recordWater: body.recordWater
      },
      select: RoomSelect
    })

    return createResponse(event, 'success', 200, room)
  }
})
