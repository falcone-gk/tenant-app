import { Prisma } from '@prisma/client'

export const paymentService = Prisma.validator<Prisma.PaymentSelect>()({
    id: true,
    tenantId: true,
    tenant: {
        select: {
            id: true,
            name: true
        }
    },
    roomId: true,
    room: {
        select: {
            id: true,
            code: true
        }
    },
    serviceId: true,
    service: {
        select: {
            id: true,
            name: true,
            unit: true
        }
    },
    amount: true,
    consume: true,
    dateToPay: true,
    paidMount: true,
    lastDatePaid: true,
    isPaid: true
})