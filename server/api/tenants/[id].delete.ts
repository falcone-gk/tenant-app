import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = getRouterParams(event).id
  await prisma.tenant.delete({
    where: {
      id: Number(id)
    }
  })
  return createResponse(event, 'success', 204)
})
