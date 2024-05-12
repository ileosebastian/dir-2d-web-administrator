import { UUID } from "../../shared/models/core.types";


export interface Professor {

    id?: string;
    name: string;
    isVisible: boolean;
    campus: string;
    faculty: string;
    department?: string;
    office?: string; // Place
    infoId: UUID;

    published?: boolean;
}