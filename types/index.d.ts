import type { $Enums } from "@prisma/client";

export type Status = 'success' | 'fail' | 'error'

declare global {
    interface ApiResponse<T> {
        status: Status;
        data?: T;
        message?: string;
    }
}

declare global {
    interface UserData {
        id: number
        username: string
        role: $Enums.Role
        token: string
    }
}