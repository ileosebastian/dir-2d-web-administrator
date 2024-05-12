import { Plane, Block, Sprite } from '../../domain/map.domain';


export class GeneratePlaneUseCase {

    constructor() { }

    run(plane: Plane, canvas: HTMLCanvasElement, showGuidelines: boolean) {
        let ctx = canvas.getContext('2d');

        if (ctx === null) return;

        this.clearCanvas(canvas, ctx);

        plane.stage.forEach(column => {
            column.forEach((row) => {
                if (ctx) {

                    // show guidelines
                    if (showGuidelines) {
                        let center = 5;
                        if (row.x === Math.floor(plane.columns / 2)) {
                            ctx.moveTo(row?.x * plane.widthTiles + center, row?.y * plane.heightTiles);
                            ctx.lineTo(row.x * plane.widthTiles + center, (row.y + 1) * plane.heightTiles);
                            ctx.strokeStyle = 'blue';
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                        if (row.y === Math.floor(plane.rows / 2)) {
                            ctx.moveTo(row?.x * plane.widthTiles, row?.y * plane.heightTiles + center);
                            ctx.lineTo((row.x + 1) * plane.widthTiles, (row.y) * plane.heightTiles + center);
                            ctx.strokeStyle = 'blue';
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                    }

                    // draw map
                    if (row.type === 'ground') {
                        ctx.fillStyle = 'white';
                        ctx.fillRect(
                            row.x * plane.widthTiles,
                            row.y * plane.heightTiles,
                            plane.heightTiles, plane.heightTiles
                        );
                    } else if (row.type === 'block') {
                        this.drawBlock(<Block>row.contain, row.x, row.y, plane.widthTiles, plane.heightTiles, ctx);
                    } else {
                        let sprite = row.contain as Sprite;
                        this.drawSprite(sprite, sprite.label || '', row.x, row.y, plane.widthTiles, plane.heightTiles, ctx);
                    }
                }
            });
        });
    }

    private clearCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        // Store the current transformation matrix
        context.save();

        // Use the identity matrix while clearing the canvas
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Restore the transform
        context.restore();
    }

    private drawBlock(
        contentToDraw: Block,
        x: number, y: number,
        widthTiles: number, heightTiles: number,
        context: CanvasRenderingContext2D
    ) {
        context.fillStyle = contentToDraw.color;
        context.fillRect(x * widthTiles, y * heightTiles, heightTiles, heightTiles);
    }

    private async drawSprite(
        contentToDraw: Sprite,
        label: string,
        x: number, y: number,
        widthTiles: number, heightTiles: number,
        context: CanvasRenderingContext2D
    ) {

        const img = new Image();
        img.src = contentToDraw.source;
        img.width = contentToDraw.width;
        img.height = contentToDraw.height;

        setTimeout(async () => {
            context.drawImage(img, x * widthTiles, y * heightTiles, img.width, img.height);

            const fontSizeInPx = Math.floor(contentToDraw.width/2.6);
            context.font = `bold ${fontSizeInPx}px Arial`;
            context.fillStyle = "black";

            // context.fillText("101", x*widthTiles + (Math.floor(contentToDraw.width/4)), y*heightTiles + (contentToDraw.height + 10));
            context.fillText(label, x*widthTiles + (Math.floor(contentToDraw.width/5)), y*heightTiles + (contentToDraw.height + 12));
        }, 50);
    }

}