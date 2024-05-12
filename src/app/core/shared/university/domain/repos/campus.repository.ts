import { Observable } from "rxjs";
import { Campus } from "../campus.domain";

export interface CampusRepository {
    getAllCampus(): Observable<Campus[]>;
}