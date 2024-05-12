import { Campus } from './campus.domain';


export class Faculty {

    readonly campus!: string;
    readonly name!: string;

    constructor(campus: string, name: string) {
        this.campus = campus;
        this.name = name;
    }

}