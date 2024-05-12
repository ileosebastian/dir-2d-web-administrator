import { Waypoint, Plane } from "../../domain/map.domain";
import { TemporalRepository } from "../../domain/repos/temporal.repository";
import { DrawWaypointUseCase } from "./draw-waypoint.usecase";


export class UpdateWaypointUseCase {
    private readonly COLOR_BY_POINTYPE: { [key: string]: string } = {
        'origin_first_floor': 'blue',
        'origin_previous_floor': 'tan',
        'origin_next_floor': 'orange',
        'previous_floor': 'purple',
        'next_floor': 'green',
        'destiny': 'red',
    };

    private draw!: DrawWaypointUseCase;

    constructor(private readonly tempRepo: TemporalRepository) {
        this.draw = new DrawWaypointUseCase();
    }

    async run(cellX: number, cellY: number, waypoint: Waypoint, plane: Plane, canvas: HTMLCanvasElement) {
        const box = plane.stage[cellX][cellY];
        const ctx = canvas.getContext('2d');

        waypoint.color = this.COLOR_BY_POINTYPE[waypoint.pointType] || 'tan';
        if (ctx) {
            plane.stage[cellX][cellY] = this.draw.run(
                box,
                waypoint,
                cellX, cellY,
                plane.widthTiles,
                plane.heightTiles,
                ctx
            );

            plane.wayPoints.map(wp => { // replace old wp for waypoint
                if (wp.uuid === waypoint.uuid) {
                    return  waypoint;
                } else {
                    return wp;
                }
            });
    
            await this.tempRepo.savePlane(`plane_${plane.floor}`, plane);
        }
    }

}