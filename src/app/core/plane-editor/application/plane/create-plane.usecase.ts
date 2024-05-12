import { TemporalRepository } from "../../domain/repos/temporal.repository";
import { Box, Building, Plane } from '../../domain/map.domain';
import { GetBuildingUseCase } from "../building/get-building.usecase";
import { UUID } from "../../../shared/models/core.types";


export class CreatePlaneUseCase {

    private getBuilding!: GetBuildingUseCase;

    constructor(private readonly tempRepo: TemporalRepository) {
        this.getBuilding = new GetBuildingUseCase(tempRepo);
    }

    async run(floor: number, canvas: HTMLCanvasElement): Promise<Plane> {
        let col = canvas.width / 10;
        let row = canvas.height / 10;

        let stage = this.create2DMatrix(row, col);

        // fill stage
        for (let c = 0; c < col; c++) { // x
            for (let r = 0; r < row; r++) { // y
                let box: Box = {
                    x: c,
                    y: r,
                    contain: null,
                    type: 'ground',
                };
                stage[c][r] = box; // x, y
            }
        }

        let buildID: UUID;
        try {
            let building: Building = this.getBuilding.run();
            buildID = building.uuid; 
        } catch (error) {
            console.error("=>", error);
            buildID = 'X-X-X-X-X';
        }

        let plane: Plane = {
            uuid: crypto.randomUUID(),
            buildingId: buildID,
            wayPoints: [], 
            floor: floor,
            columns: col,
            rows: row,
            widthTiles: Math.floor(canvas.height / row),
            heightTiles: Math.floor(canvas.height / row),
            stage: stage,
        };

        await this.tempRepo.savePlane(`plane_${floor}`, plane);
        return plane;
    }

    private create2DMatrix(rows: number, columns: number): Box[][] {
        let obj = new Array(columns);

        for (let i = 0; i < obj.length; i++) {
            obj[i] = new Array(rows);
        }

        return obj;
    }

}