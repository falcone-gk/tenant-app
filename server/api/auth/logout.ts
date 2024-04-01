import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: Create a new way to logout because user is always undefined
  // in this case.
  const user = event.context.user

  if (user) {
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        token: null
      }
    })
  }

  return createResponse(event, 'success', 200, undefined, 'Cierre de sesión exitoso')
})
