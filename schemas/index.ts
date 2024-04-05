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

export const paymentSchema = z.object({
    tenantId: z.number(),
    roomId: z.number(),
    serviceId: z.number(),
    amount: z.number(),
    consume: z.number().nullable(),
    dateToPay: z.string().min(1, { message: 'Campo requerido' }),
    paidMount: z.number().min(0, { message: 'Campo debe ser mayor o igual que 0' }),
})

export const paginationSchema = z.object({
    page: z.string().refine((val) => /^\d+$/.test(val), { message: 'Solo se permiten números' }),
    limit: z.string().refine((val) => /^\d+$/.test(val), { message: 'Solo se permiten números' }),
})