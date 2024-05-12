

export class DrawSpriteUseCase {

    constructor() { }

    async run(
        contentToDraw: HTMLImageElement,
        label: string,
        x: number, y: number,
        widthTiles: number, heightTiles: number,
        context: CanvasRenderingContext2D
    ) {
        setTimeout(() => {
            context.drawImage(contentToDraw, x * widthTiles, y * heightTiles, contentToDraw.width, contentToDraw.height);
            let fontSizeInPx = Math.floor(contentToDraw.width/2.6);
            context.font = `bold ${fontSizeInPx}px Arial`;
            context.fillStyle = "black";

            // context.fillText("101", x*widthTiles + (Math.floor(contentToDraw.width/4)), y*heightTiles + (contentToDraw.height + 10));
            context.fillText(label, x*widthTiles + (Math.floor(contentToDraw.width/5)), y*heightTiles + (contentToDraw.height + 10));
        }, 50);
    }

}