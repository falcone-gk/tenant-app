import { tenantSchema } from "~/schemas"
import type { TenantData } from '~/types/admin'
import isAuthenticated from "~/server/permission/isAuthenticated"
import { pgClient } from "~/server/utils/prismaClient"

const prisma = pgClient()

export default defineEventHandler({
  onRequest: [isAuthenticated],
  handler: async (event) => {
    const id = getRouterParams(event).id
    const body = await readValidatedBody(event, tenantSchema.parse)

    const tenant = await prisma.tenant.update({
      where: {
        id: Number(id)
      },
      data: {
        name: body.name,
        joinDate: body.joinDate,
        dayToPay: body.dayToPay,
        rooms: {
          set: body.rooms.map((value) => { return { id: value } })
        }
      },
      select: {
        id: true,
        name: true,
        joinDate: true,
        dayToPay: true,
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
