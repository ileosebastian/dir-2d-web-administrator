import { Plane, Waypoint } from "../../domain/map.domain";
import { TemporalRepository } from "../../domain/repos/temporal.repository";
import { DrawWaypointUseCase } from "./draw-waypoint.usecase";


export class AddWaypointUseCase {

    private readonly draw!: DrawWaypointUseCase;

    constructor(private readonly tempRepo: TemporalRepository) {
        this.draw = new DrawWaypointUseCase();
    }

    run(cellX: number, cellY: number, plane: Plane, canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');

        const waypoint: Waypoint = {
            uuid: crypto.randomUUID(),
            name: `origen ${plane.floor === 1 ? 'PB' : 'P'+(plane.floor-1)}`,
            pointType: 'origin_first_floor',
            color: 'blue',
            blockType: 'waypoint'
        };

        if (ctx) {
            plane.stage[cellX][cellY] = this.draw.run(
                plane.stage[cellX][cellY],
                waypoint,
                cellX, cellY,
                plane.widthTiles,
                plane.heightTiles,
                ctx
            );

            plane.wayPoints.push(waypoint);

            // update current plane
            this.tempRepo.savePlane(`plane_${plane.floor}`, plane);
        }

        return plane.stage[cellX][cellY];
    }

}