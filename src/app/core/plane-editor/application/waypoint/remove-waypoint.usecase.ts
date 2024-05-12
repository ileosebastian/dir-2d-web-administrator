import { Box, Plane, Waypoint } from "../../domain/map.domain";
import { TemporalRepository } from "../../domain/repos/temporal.repository";
import { FindBoxContainerUseCase } from '../utils/find-box-container.usecase';


export class RemoveWaypointUseCase {

    private findBox!: FindBoxContainerUseCase;

    constructor(private readonly tempRepo: TemporalRepository) {
        this.findBox = new FindBoxContainerUseCase();
    }

    async run(cellX: number, cellY: number, plane: Plane, canvas: HTMLCanvasElement) {
        let currentSelected = this.findBox.run(cellX, cellY, plane);
        let ctx = canvas.getContext('2d');

        if (ctx && currentSelected.boxSelected.type === 'block' && currentSelected.content !== 'ground') {
            let oldWaypoint: Waypoint = currentSelected.content as Waypoint;
            let newBox: Box = {
                x: cellX,
                y: cellY,
                contain: null,
                type: 'ground'
            };

            plane.stage[cellX][cellY] = newBox; // replace totally
            plane.wayPoints = plane.wayPoints.filter(waypoint => waypoint.uuid !== oldWaypoint.uuid); // remove from arrya

            this.drawGround(cellX, cellY, plane.widthTiles, plane.heightTiles, ctx);

            await this.tempRepo.savePlane(`plane_${plane.floor}`, plane);
        } else {
            throw new Error("This box isn't a block type!");
        }
    }

    private drawGround(
        x: number, y: number,
        widthTiles: number, heightTiles: number,
        context: CanvasRenderingContext2D
    ) {
        context.fillStyle = 'white';
        context.fillRect(x* widthTiles, y*heightTiles, heightTiles, heightTiles);
    }

}