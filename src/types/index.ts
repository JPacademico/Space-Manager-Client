export interface Space {
    id: string;
    name: string;
    type: string;
    capacity: number;
    description?: string;
}

export interface Booking {
    id: string;
    startDate: string;
    endDate: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    space?: Space;
    user?: { email: string };
}