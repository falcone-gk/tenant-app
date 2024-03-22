import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = event.context.user
  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      token: null
    }
  })
  return createResponse(event, 'success', 200, undefined, 'Cierre de sesión exitoso')
})
