import { roomSchema } from "~/schemas"
import type { RoomData } from "~/types/admin"
import isAuthenticated from "~/server/permission/isAuthenticated"
import { pgClient } from "~/server/utils/prismaClient"

const prisma = pgClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {
    const id = getRouterParams(event).id
    const body = await readValidatedBody(event, roomSchema.parse)

    const room = await prisma.room.update({
      where: {
        id: Number(id)
      },
      data: {
        code: body.code,
        reference: body.reference,
        floor: body.floor,
        tenantId: body.tenantId,
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
