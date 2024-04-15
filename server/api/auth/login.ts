import { pgClient } from "~/server/utils/prismaClient"
import { checkPassword } from "~/server/utils/bcrypt"
import { createResponse } from "~/server/utils/response"
import jwt from 'jsonwebtoken'

const prisma = pgClient()

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const user = await prisma.user.findFirst({
    where: {
      username: body.username
    },
    select: {
      id: true,
      username: true,
      password: true,
      role: true
    }
  })

  // check user
  if (!user) {
    return createResponse(event, 'fail', 400, undefined, 'Nombre de usuario o contraseña incorrectos')
  }

  // check password
  const { password, ...userWithoutPassword } = user
  const isPasswordValid = await checkPassword(body.password, password)
  if (!isPasswordValid) {
    return createResponse(event, 'fail', 400, undefined, 'Nombre de usuario o contraseña incorrectos')
  }

  const secretKey = config.public.jwtSecretKey as string
  const maxAge = config.public.tokenMaxAge as string
  const token = jwt.sign(userWithoutPassword, secretKey, {
    expiresIn: maxAge
  })

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      token
    }
  })

  const data = {
    ...userWithoutPassword,
    token: token
  }

  return createResponse<UserData>(event, 'success', 200, data)
})
