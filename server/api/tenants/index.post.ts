import { PrismaClient } from "@prisma/client"
import { tenantSchema } from "~/schemas"
import type { TenantData } from '~/types/admin'
import isAuthenticated from '~/server/permission/isAuthenticated'

const prisma = new PrismaClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {
    const body = await readValidatedBody(event, tenantSchema.parse)

    const tenant = await prisma.tenant.create({
      data: {
        name: body.name,
        createdAt: body.createdAt,
        rooms: {
          connect: body.rooms.map((value) => { return { id: value } })
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
  }
})