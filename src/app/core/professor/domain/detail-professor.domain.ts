
interface Schecule {
    first: string;
    second: string;
}

type UUID = `${string}-${string}-${string}-${string}-${string}`

export interface DetailProfessor {
    id?: string;
    uuid: UUID;
    category: string;
    dedication: string;
    email: string;
    schedule: Schecule;

    published?: boolean;
}