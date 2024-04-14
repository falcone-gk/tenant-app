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

export const tenantFormSchema = z.object({
    name: z.string().min(1, { message: 'Campo requerido' }),
    dayToPay: z.number({ invalid_type_error: "Dia inválido", required_error: "Campo requerido" }).min(1),
    joinDate: z.date({ invalid_type_error: "Fecha inválida", required_error: "Campo requerido" }),
    rooms: z.array(z.number()),
})

export const roomSchema = z.object({
    code: z.string().min(1, { message: 'Campo requerido' }),
    reference: z.string().min(1, { message: 'Campo requerido' }),
    floor: z.number({ invalid_type_error: "Piso inválido", required_error: "Campo requerido" }),
    tenantId: z.number().nullable(),
})

export const paymentSchema = z.object({
    tenantId: z.number({ invalid_type_error: "Campo requerido" }),
    roomId: z.number({ invalid_type_error: "Campo requerido" }),
    serviceId: z.number({ invalid_type_error: "Campo requerido" }),
    amount: z.number({ invalid_type_error: "Campo requerido" }).min(1, { message: 'Campo debe ser mayor o igual que 1' }),
    consume: z.number().nullable(),
    dateToPay: z.coerce.date(),
    lastDatePaid: z.coerce.date().nullable(),
    amountPaid: z.number().min(0, { message: 'Campo debe ser mayor o igual que 0' }),
})

export const addPaySchema = z.object({
    amount: z.number({ invalid_type_error: "Campo requerido" }).min(1, { message: 'Campo debe ser mayor o igual que 1' }),
    amountPaid: z.number({ invalid_type_error: "Campo requerido" }).min(0, { message: 'Campo debe ser mayor o igual que 0' }),
    newPayment: z.number({ invalid_type_error: "Campo requerido" }).min(1, { message: 'Campo debe ser mayor o igual que 0' }),
}).superRefine(({ amount, amountPaid, newPayment }, ctx) => {
    if (amountPaid < (-1) * newPayment) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'La reducción del pago no puede ser mayor al importe ya realizado',
            path: ['newPayment']
        })
    } else if (amountPaid + newPayment === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'El pago no puede ser 0',
            path: ['newPayment']
        })
    } else if (amount < amountPaid + newPayment) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'El pago no puede ser mayor al importe',
            path: ['newPayment']
        })
    }
})
// Comment this validation because by now this field mustn't be filled
/*     .superRefine(({ consume, serviceId }, ctx) => {
        if (consume === null && (serviceId === 1 || serviceId === 2)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Campo requerido',
                path: ['consume']
            })
        }
    }) */

export const totalPaymentSchema = z.object({
    serviceId: z.number({ invalid_type_error: "Campo requerido" }),
    registerDate: z.coerce.date({ invalid_type_error: "Fecha inválida", required_error: "Campo requerido" }),
    amount: z.number({ invalid_type_error: "Campo requerido" }).min(1, { message: 'Campo debe ser mayor o igual que 1' }),
    consume: z.number().nullable(),
    outageDate: z.coerce.date().nullable(),
    isPaid: z.boolean()
})

export const paginationSchema = z.object({
    //page: z.string().refine((val) => /^\d+$/.test(val), { message: 'Solo se permiten números' }),
    //limit: z.string().refine((val) => /^\d+$/.test(val), { message: 'Solo se permiten números' }),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    tenantId: z.coerce.number(),
    serviceId: z.coerce.number(),
    isPaid: z.enum(['true', 'false']).transform((value) => value === 'true')
})