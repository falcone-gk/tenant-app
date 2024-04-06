export interface RoomData {
    id: number;
    code: string;
    reference: string;
    floor: number | null;
    tenant?: { id: number, name: string } | null;
    tenantId?: number | null;
    isAvailable: boolean
}

export interface RoomDataTable {
    id: number;
    code: string;
    reference: string;
    floor: number | null;
    tenant: string;
}

export interface TenantData {
    id: number
    name: string
    dayToPay: number
    joinDate: Date
    rooms: { id: number, code: string }[]
}

export interface TenantDataTable {
    id: number
    name: string
    joinDate: string
    dayToPay: number | null
    rooms: string
}

export interface PaymentData {
    id: number
    tenantId: number
    tenant: { id: number, name: string }
    roomId: number
    room: { id: number, code: string }
    serviceId: number
    service: { id: number, name: string, unit: string }
    amount: number
    consume: number | null,
    dateToPay: string
    paidMount: number
    lastDatePaid: Date | null
    isPaid: boolean
}

export interface DataAdmin {
    tenants: TenantData[]
    rooms: RoomData[]
}