interface IPoint {
	x: number
	y: number
}

interface IColor {
	primary: string
	secondary: string
}

interface ITool {
	toolName: string
	startPoint: IPoint
	onStart: (ctx: CanvasRenderingContext2D, mousePosition: IPoint, pickedColors: IColor) => void
	onMove: (ctx: CanvasRenderingContext2D, mousePosition: IPoint, pickedColors: IColor) => void
	onEnd: (ctx: CanvasRenderingContext2D, mousePosition: IPoint, pickedColors: IColor) => void
}

export class IBristle {
	opacity: number
	x: number
	y: number
	r: number
	colorModifier: number

	constructor(r: number = 1, opacity: number = 1, x: number = 0, y: number = 0, colorModifier?: number) {
		this.opacity = opacity
		this.x = x
		this.y = y
		this.r = r
		this.colorModifier = colorModifier
	}
}

export class Drawable implements ITool {
	toolName: string
	opacity: number = 1
	drawingShape: IBristle[]
	startPoint: IPoint
	previousPoint: IPoint
	size: number = 100

	constructor(toolName: string, drawingShape: IBristle[]) {
		this.toolName = toolName
		this.drawingShape = drawingShape
	}


	onStart(ctx: CanvasRenderingContext2D, mousePosition: IPoint, pickedColors: IColor) {
		console.log("sus")
		this.startPoint = mousePosition
		ctx.globalCompositeOperation = "difference";
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.globalCompositeOperation = "lighten";
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		for (let bristle of this.drawingShape.sort((el1, el2) => el1.opacity - el2.opacity)) {
			console.log(bristle.opacity)
			ctx.globalAlpha = this.opacity * bristle.opacity
			ctx.beginPath()
			ctx.moveTo(mousePosition.x + bristle.x, mousePosition.y + bristle.y)
			ctx.lineWidth = bristle.r * 2 * this.size
			ctx.lineTo(mousePosition.x + bristle.x, mousePosition.y + bristle.y + 0.01)
			ctx.stroke()
			//TO-DO: implement hsv modifier
		}
		this.previousPoint = this.startPoint
	}
	onMove(ctx: CanvasRenderingContext2D, mousePosition: IPoint, pickedColors: IColor) {
		ctx.globalCompositeOperation = "difference";
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.globalCompositeOperation = "lighten";
		for (let bristle of this.drawingShape) {
			let color = pickedColors.primary + (255 * this.opacity * bristle.opacity).toString(16).padStart(2, "0")
			ctx.strokeStyle = color
			ctx.moveTo(this.previousPoint.x + bristle.x, this.previousPoint.y + bristle.y)
			ctx.lineWidth = bristle.r * 2 * this.size
			ctx.lineTo(mousePosition.x + bristle.x, mousePosition.y + bristle.y)
			ctx.stroke()
			//TO-DO: implement hsv modifier
		}
		ctx.globalCompositeOperation = "difference";
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		this.previousPoint = mousePosition
	}
	onEnd(context: CanvasRenderingContext2D, mousePosition: IPoint, pickedColors: IColor) {
		context.stroke()
		context.closePath()
	}
}

export class Selectable implements ITool {
	toolName: string
	startPoint: IPoint

	onStart: (context: CanvasRenderingContext2D, mousePosition: IPoint, pickedColors: IColor) => void
	onMove: (context: CanvasRenderingContext2D, mousePosition: IPoint, pickedColors: IColor) => void
	onEnd: (context: CanvasRenderingContext2D, mousePosition: IPoint, pickedColors: IColor) => void

}