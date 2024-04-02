export interface RoomData {
    id: number;
    code: string;
    reference: string;
    floor: number | null;
    tenant?: { id: number, name: string } | null;
    tenantId?: number | null;
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
    dayToPay: number | null
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

export interface DataAdmin {
    tenants: TenantData[]
    rooms: RoomData[]
}