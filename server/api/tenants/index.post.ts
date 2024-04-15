import { tenantSchema } from "~/schemas"
import type { TenantData } from '~/types/admin'
import isAuthenticated from '~/server/permission/isAuthenticated'
import { pgClient } from "~/server/utils/prismaClient"

const prisma = pgClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {
    const body = await readValidatedBody(event, tenantSchema.parse)

    const tenant = await prisma.tenant.create({
      data: {
        name: body.name,
        joinDate: body.joinDate,
        dayToPay: body.dayToPay,
        rooms: {
          connect: body.rooms.map((value) => { return { id: value } })
        }
      },
      select: {
        id: true,
        name: true,
        dayToPay: true,
        joinDate: true,
        debt: true,
        rooms: {
          select: {
            id: true,
            code: true,
          }
        }
      }
    })

    return createResponse(event, 'success', 200, tenant)
  }
})