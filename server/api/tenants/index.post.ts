import { z } from 'zod'
import { PrismaClient } from "@prisma/client"
import { tenantSchema } from "~/schemas"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    tenantSchema.parse(body)
  } catch (err) {
    if (err instanceof z.ZodError) {
      const path = err.issues[0].path[0]
      const errorData = {
        [path]: err.issues[0].message,
      }
      return createResponse(event, 'fail', 400, errorData)
    }
  }

  const tenant = await prisma.tenant.create({
    data: {
      name: body.name,
      createdAt: body.createdAt,
      rooms: {
        connect: body.rooms
      }
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      rooms: {
        select: {
          id: true,
        }
      }
    }
  })

  return createResponse(event, 'success', 200, tenant)
})