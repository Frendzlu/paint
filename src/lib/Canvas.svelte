<script lang="ts">
	import { onMount } from "svelte/internal";
	import { listener } from "../KeyListener";
	import {
		Circle,
		Drawable,
		IBristle,
		Rectangle,
		type IPaint,
		type ITool,
	} from "../Tool";

	let mainCanvasRef: HTMLCanvasElement;
	let iconCanvasRef: HTMLCanvasElement;
	let preCommitCanvasRef: HTMLCanvasElement;
	let offsetLeft: number, offsetTop: number;
	$: mainCtx = mainCanvasRef?.getContext("2d");
	$: preCtx = preCommitCanvasRef?.getContext("2d");
	export let paint: IPaint;

	let pencil = new Drawable("Pencil", [new IBristle()]);
	let circle = new Circle();
	let rect = new Rectangle();

	export let tool: ITool = rect;

	let qualityMod = 2;
	let imageStack: ImageData[] = [];

	function recomputeWidth() {
		offsetLeft = mainCanvasRef?.parentElement.offsetLeft;
		offsetTop = mainCanvasRef?.parentElement.offsetTop;
	}

	addEventListener("resize", recomputeWidth);

	onMount(() => {
		console.log(mainCanvasRef.parentElement);
		mainCanvasRef.width =
			parseInt(
				window
					.getComputedStyle(mainCanvasRef.parentElement)
					.getPropertyValue("width")
			) * qualityMod;
		mainCanvasRef.height =
			parseInt(
				window
					.getComputedStyle(mainCanvasRef.parentElement)
					.getPropertyValue("height")
			) * qualityMod;
		mainCtx = mainCanvasRef.getContext("2d");
		preCtx = preCommitCanvasRef.getContext("2d");
		preCtx.lineCap = "round";
		preCtx.lineJoin = "round";
		preCtx.lineWidth = paint.size * qualityMod;
		mainCtx.fillStyle = "white";
		mainCtx.fillRect(0, 0, mainCanvasRef.width, mainCanvasRef.height);
		mainCtx.fillStyle = paint.color.primary;
		imageStack.push(
			mainCtx.getImageData(
				0,
				0,
				mainCanvasRef.width,
				mainCanvasRef.height
			)
		);
		iconCanvasRef.width = mainCanvasRef.width;
		iconCanvasRef.height = mainCanvasRef.height;
		preCommitCanvasRef.width = mainCanvasRef.width;
		preCommitCanvasRef.height = mainCanvasRef.height;
		offsetLeft = mainCanvasRef?.parentElement.offsetLeft;
		offsetTop = mainCanvasRef?.parentElement.offsetTop;
		setListeners();
	});

	$: {
		if (preCtx) {
			preCtx.strokeStyle = paint.color.primary;
			preCtx.fillStyle = paint.color.secondary;
			preCtx.lineWidth = paint.size * qualityMod;
		}
	}

	const setListeners = () => {
		iconCanvasRef.addEventListener(
			"mousedown",
			listenerHandlers.start,
			false
		);
		iconCanvasRef.addEventListener(
			"mousemove",
			listenerHandlers.draw,
			false
		);
		iconCanvasRef.addEventListener("mouseup", listenerHandlers.end, false);
		iconCanvasRef.addEventListener("mousemove", listenerHandlers.drawIcon);
		iconCanvasRef.addEventListener("mouseleave", () =>
			listenerHandlers.emptyCanvas(iconCanvasRef)
		);
	};

	function rX(e: MouseEvent) {
		return (
			((e.clientX - offsetLeft) /
				mainCanvasRef.parentElement.offsetWidth) *
			mainCanvasRef.width
		);
	}

	function rY(e: MouseEvent) {
		return (
			((e.clientY - offsetTop) /
				mainCanvasRef.parentElement.offsetHeight) *
			mainCanvasRef.height
		);
	}

	const listenerHandlers = {
		start: (e) => {
			imageStack.push(
				mainCtx.getImageData(
					0,
					0,
					mainCanvasRef.width,
					mainCanvasRef.height
				)
			);
			paint.drawing = true;
			tool.onStart(
				preCtx,
				{
					x: rX(e),
					y: rY(e),
				},
				paint
			);
			e.preventDefault();
		},
		draw: (e) => {
			if (!paint.drawing) return;
			tool.onMove(
				preCtx,
				{
					x: rX(e),
					y: rY(e),
				},
				paint
			);
			e.preventDefault();
		},
		end: (e) => {
			if (!paint.drawing) return;
			paint.drawing = false;
			tool.onEnd(preCtx, mainCtx);
			preCtx.clearRect(0, 0, preCtx.canvas.width, preCtx.canvas.height);
			e.preventDefault();
		},
		drawIcon: (e) => {
			let ctx = iconCanvasRef.getContext("2d");
			let img = document.getElementById("iconImage") as HTMLImageElement;
			let width = 70;
			let height = 70;
			ctx.clearRect(0, 0, iconCanvasRef.width, iconCanvasRef.height);
			ctx.drawImage(
				img,
				rX(e) - width * 0.5,
				rY(e) - height * 0.5,
				width,
				height
			);
		},
		emptyCanvas: (canvas: HTMLCanvasElement) => {
			canvas
				.getContext("2d")
				.clearRect(0, 0, canvas.width, canvas.height);
		},
	};

	function getImage() {
		return mainCanvasRef.toDataURL("image/png");
	}

	listener.registerDown("Control+S", () => {
		let link = document.createElement("a");
		link.download = "image.png";
		link.href = mainCanvasRef?.toDataURL();
		link.click();
	});
	listener.registerDown("Control+Z", revert);

	let sus = true;

	listener.registerDown("Shift", () => (sus = false));
	listener.registerUp("Shift", () => (sus = true));

	function revert() {
		if (imageStack.length > 0) mainCtx.putImageData(imageStack.pop(), 0, 0);
	}
</script>

{sus}
<div id="canvasDiv">
	<canvas
		id="iconCanvas"
		bind:this={iconCanvasRef}
		width="150"
		height="150"
		style="z-index: 10000;"
	/>
	<canvas
		id="preCommitCanvas"
		bind:this={preCommitCanvasRef}
		width="150"
		height="150"
		style="z-index: 1000;"
	/>
	<canvas id="canvas" bind:this={mainCanvasRef} width="150" height="150" />
</div>

<style>
	#canvasDiv {
		cursor: none;
		width: 90vw;
		height: 80vh;
		margin-top: 1rem;
		position: relative;
	}

	#canvas,
	#iconCanvas,
	#preCommitCanvas {
		position: absolute;
		left: 0px;
		top: 0px;
		image-rendering: pixelated;
		image-rendering: crisp-edges;
		width: 100%;
		height: 100%;
	}
</style>
