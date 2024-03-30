export interface RoomData {
    id: number;
    code: string;
    reference: string;
    floor: number | null;
    tenant: { id: number, name: string } | null;
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
    createdAt: Date
    rooms: { id: number, code: string }[]
}

export interface TenantDataTable {
    id: number
    name: string
    createdAt: string
    rooms: string
}

export interface DataAdmin {
    tenants: TenantData[]
    rooms: RoomData[]
}