import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

  const tenants = await prisma.tenant.findMany()
  return createResponse(event, 'success', 200, tenants)
})
