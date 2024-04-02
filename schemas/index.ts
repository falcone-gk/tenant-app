import { z } from 'zod'

export const loginSchema = z.object({
    username: z.string().min(1, { message: 'Campo requerido' }),
    password: z.string().min(1, { message: 'Campo requerido' })
})

export const tenantSchema = z.object({
    name: z.string().min(1, { message: 'Campo requerido' }),
    dayToPay: z.number().min(1, { message: 'Campo debe ser mayor que 1' }).max(31, { message: 'Campo debe ser menor que 31' }),
    joinDate: z.string().min(1, { message: 'Campo requerido' }),
    rooms: z.array(z.number()),
})

export const roomSchema = z.object({
    code: z.string().min(1, { message: 'Campo requerido' }),
    reference: z.string().min(1, { message: 'Campo requerido' }),
    floor: z.number(),
    tenantId: z.number().nullable(),
})