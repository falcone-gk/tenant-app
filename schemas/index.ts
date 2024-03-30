import { z } from 'zod'

export const loginSchema = z.object({
    username: z.string().min(1, { message: 'Campo requerido' }),
    password: z.string().min(1, { message: 'Campo requerido' })
})

export const tenantSchema = z.object({
    name: z.string().min(1, { message: 'Campo requerido' }),
    createdAt: z.string().min(1, { message: 'Campo requerido' }),
    rooms: z.array(z.number()),
})