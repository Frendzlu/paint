interface IPoint {
	x: number
	y: number
}

interface IColor {
	primary: string
	secondary: string
}

export interface IPaint {
	size: number
	color: IColor
	drawing: boolean
	opacity: number
}

export interface ITool {
	toolName: string
	startPoint: IPoint
	onStart: (ctx: CanvasRenderingContext2D, mousePosition: IPoint, paint: IPaint) => void
	onMove: (ctx: CanvasRenderingContext2D, mousePosition: IPoint, paint: IPaint) => void
	onEnd: (sourceCtx: CanvasRenderingContext2D, destCtx: CanvasRenderingContext2D) => void
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
	drawingShape: IBristle[]
	startPoint: IPoint
	previousPoint: IPoint

	constructor(toolName: string, drawingShape: IBristle[]) {
		this.toolName = toolName
		this.drawingShape = drawingShape
	}


	onStart(ctx: CanvasRenderingContext2D, mousePosition: IPoint, paint: IPaint) {
		console.log("sus")
		this.startPoint = mousePosition
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		for (let bristle of this.drawingShape.sort((el1, el2) => el1.opacity - el2.opacity)) {
			console.log(bristle.opacity)
			ctx.globalAlpha = paint.opacity * bristle.opacity
			ctx.beginPath()
			ctx.moveTo(this.startPoint.x + bristle.x, this.startPoint.y + bristle.y)
			ctx.lineWidth = bristle.r * 2 * paint.size
			ctx.lineTo(mousePosition.x + bristle.x, mousePosition.y + bristle.y + 0.01)
			ctx.stroke()
			//TO-DO: implement hsv modifier
		}
		this.previousPoint = this.startPoint
	}
	onMove(ctx: CanvasRenderingContext2D, mousePosition: IPoint, paint: IPaint) {
		for (let bristle of this.drawingShape) {
			let color = paint.color.primary + (255 * paint.opacity * bristle.opacity).toString(16).padStart(2, "0")
			ctx.strokeStyle = color
			ctx.moveTo(this.previousPoint.x + bristle.x, this.previousPoint.y + bristle.y)
			ctx.lineWidth = bristle.r * 2 * paint.size
			ctx.lineTo(mousePosition.x + bristle.x, mousePosition.y + bristle.y)
			ctx.stroke()
			//TO-DO: implement hsv modifier
		};
		this.previousPoint = mousePosition
	}
	onEnd(sourceCtx: CanvasRenderingContext2D, destCtx: CanvasRenderingContext2D) {
		sourceCtx.stroke()
		sourceCtx.closePath()
		destCtx.drawImage(sourceCtx.canvas, 0, 0)
	}
}

export class Selectable implements ITool {
	toolName: string
	startPoint: IPoint

	onStart: (context: CanvasRenderingContext2D, mousePosition: IPoint, paint: IPaint) => void
	onMove: (context: CanvasRenderingContext2D, mousePosition: IPoint, paint: IPaint) => void
	onEnd: (sourceCtx: CanvasRenderingContext2D, destCtx: CanvasRenderingContext2D) => void
}

export class Circle implements ITool {
	toolName: "circle"
	startPoint: IPoint
	fill: boolean = false

	constructor() { }

	onStart(ctx: CanvasRenderingContext2D, mousePosition: IPoint, paint: IPaint) {
		this.startPoint = mousePosition
	}
	onMove(ctx: CanvasRenderingContext2D, mousePosition: IPoint, paint: IPaint) {
		ctx.beginPath()
		let color = paint.color.primary + (255 * paint.opacity).toString(16).padStart(2, "0")
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		ctx.strokeStyle = color
		let sX = (mousePosition.x + this.startPoint.x) / 2
		let sY = (mousePosition.y + this.startPoint.y) / 2
		ctx.lineWidth = 2 * paint.size
		ctx.ellipse(sX, sY, Math.abs(mousePosition.x - sX), Math.abs(mousePosition.y - sY), 0, 0, Math.PI * 2)

		if (this.fill) ctx.fill()

		ctx.stroke()
	}
	onEnd(sourceCtx: CanvasRenderingContext2D, destCtx: CanvasRenderingContext2D) {
		destCtx.drawImage(sourceCtx.canvas, 0, 0)
	}
}

export class Rectangle implements ITool {
	toolName: "rectangle"
	startPoint: IPoint
	fill: boolean = true

	constructor() { }

	onStart(ctx: CanvasRenderingContext2D, mousePosition: IPoint, paint: IPaint) {
		this.startPoint = mousePosition
	}

	onMove(ctx: CanvasRenderingContext2D, mousePosition: IPoint, paint: IPaint) {
		ctx.beginPath()
		let color = paint.color.primary + (255 * paint.opacity).toString(16).padStart(2, "0")
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		ctx.strokeStyle = color
		let sX = (mousePosition.x + this.startPoint.x) / 2
		let sY = (mousePosition.y + this.startPoint.y) / 2
		ctx.lineWidth = 2 * paint.size
		ctx.moveTo(this.startPoint.x, this.startPoint.y)
		ctx.lineTo(this.startPoint.x, mousePosition.y)
		ctx.lineTo(mousePosition.x, mousePosition.y)
		ctx.lineTo(mousePosition.x, this.startPoint.y)
		ctx.closePath()
		ctx.stroke()
		if (this.fill) ctx.fill()
	}

	onEnd(sourceCtx: CanvasRenderingContext2D, destCtx: CanvasRenderingContext2D) {
		destCtx.drawImage(sourceCtx.canvas, 0, 0)
	}
}

//jedno wielkie todo
// export class Shapes implements ITool {
// 	toolName: string
// 	startPoint: IPoint
// 	pointBasics

// 	constructor(toolName: string, drawingShape: IBristle[]) {
// 		this.toolName = toolName
// 		this.drawingShape = drawingShape
// 	}

// 	onStart: (ctx: CanvasRenderingContext2D, mousePosition: IPoint, paint: IPaint) => void
// 	onMove: (ctx: CanvasRenderingContext2D, mousePosition: IPoint, paint: IPaint) => void
// 	onEnd: (sourceCtx: CanvasRenderingContext2D, destCtx: CanvasRenderingContext2D) => void
// }