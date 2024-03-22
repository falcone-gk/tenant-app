import { z } from 'zod'

export const loginSchema = z.object({
    username: z.string().min(1, { message: 'Campo requerido' }),
    password: z.string().min(1, { message: 'Campo requerido' })
})