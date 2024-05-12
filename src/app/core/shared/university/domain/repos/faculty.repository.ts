import { Observable } from "rxjs";
import { Faculty } from "../faculty.domain";


export interface FacultyRepository {
    getAllFaculties(): Observable<Faculty[]>;
    getFacultyByCampus(campusName: string): Observable<Faculty[]>
}