import { z } from 'zod'
import { PrismaClient } from "@prisma/client"
import { tenantSchema } from "~/schemas"
import type { TenantData } from '~/types/admin'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  type Tenant = z.infer<typeof tenantSchema>
  const id = getRouterParams(event).id
  const body = await readBody<Tenant>(event)

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

  const tenant = await prisma.tenant.update({
    where: {
      id: Number(id)
    },
    data: {
      name: body.name,
      createdAt: body.createdAt,
      rooms: {
        set: body.rooms.map((value) => { return { id: value } })
      }
    },
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

  return createResponse<TenantData>(event, 'success', 200, tenant)
})
