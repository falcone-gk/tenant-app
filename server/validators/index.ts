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
    amountPaid: true,
    lastDatePaid: true,
    isPaid: true
})

export const totalPaymentService = Prisma.validator<Prisma.TotalPaymentSelect>()({
    id: true,
    amount: true,
    consume: true,
    registerDate: true,
    isPaid: true,
    serviceId: true,
    service: {
        select: {
            id: true,
            name: true,
            unit: true
        }
    },
    outageDate: true
})

export const RoomSelect = Prisma.validator<Prisma.RoomSelect>()({
    id: true,
    code: true,
    reference: true,
    floor: true,
    tenantId: true,
    tenant: {
        select: {
            id: true,
            name: true
        }
    },
    recordLight: true,
    recordWater: true
})