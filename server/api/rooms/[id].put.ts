import { roomSchema } from "~/schemas"
import { z } from 'zod'
import { PrismaClient } from "@prisma/client"
import type { RoomData } from "~/types/admin"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = getRouterParams(event).id
  const body = await readBody(event)

  try {
    roomSchema.parse(body)
  } catch (err) {
    if (err instanceof z.ZodError) {
      const path = err.issues[0].path[0]
      const errorData = {
        [path]: err.issues[0].message,
      }
      return createResponse(event, 'fail', 400, errorData)
    }
  }

  const room = await prisma.room.update({
    where: {
      id: Number(id)
    },
    data: {
      code: body.code,
      reference: body.reference,
      floor: body.floor
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
})
