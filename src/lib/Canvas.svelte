<script lang="ts">
	import { onMount } from "svelte/internal";
	import { listener } from "../KeyListener";

	let canvasRef: HTMLCanvasElement;
	let iconRef: HTMLCanvasElement;
	let offsetLeft, offsetTop;
	$: context = canvasRef?.getContext("2d");
	export let paint;

	let pencil = new Drawable("Pencil", [new IBristle()]);

	let qualityMod = 1;

	let imageStack: ImageData[] = [];

	function recomputeWidth() {
		let previousImage = getImage();
		canvasRef.width =
			parseInt(
				window
					.getComputedStyle(canvasRef.parentElement)
					.getPropertyValue("width")
			) * qualityMod;
		canvasRef.height =
			parseInt(
				window
					.getComputedStyle(canvasRef.parentElement)
					.getPropertyValue("height")
			) * qualityMod;
		iconRef.width = canvasRef.width;
		iconRef.height = canvasRef.height;
		context = canvasRef.getContext("2d");
		context.imageSmoothingEnabled = false;
		var image = new Image();
		image.src = previousImage;
		image.onload = () => {
			context.drawImage(image, 0, 0, canvasRef.width, canvasRef.height);
			console.log("loaded");
			context.imageSmoothingEnabled = true;
			context.lineCap = "round";
			context.lineJoin = "round";
		};
	}

	addEventListener("resize", recomputeWidth);

	onMount(() => {
		console.log(canvasRef.parentElement);
		canvasRef.width =
			parseInt(
				window
					.getComputedStyle(canvasRef.parentElement)
					.getPropertyValue("width")
			) * qualityMod;
		canvasRef.height =
			parseInt(
				window
					.getComputedStyle(canvasRef.parentElement)
					.getPropertyValue("height")
			) * qualityMod;
		context = canvasRef.getContext("2d");
		context.lineCap = "round";
		context.lineJoin = "round";
		context.lineWidth = paint.drawSize * qualityMod;
		context.fillStyle = "white";
		context.fillRect(0, 0, canvasRef.width, canvasRef.height);
		context.fillStyle = paint.colour.primary;
		imageStack.push(
			context.getImageData(0, 0, canvasRef.width, canvasRef.height)
		);
		offsetLeft = canvasRef.parentElement.offsetLeft;
		offsetTop = canvasRef.parentElement.offsetTop;
		iconRef.width = canvasRef.width;
		iconRef.height = canvasRef.height;
		setListeners();
	});

	$: {
		if (context) {
			context.strokeStyle = paint.colour.primary;
			context.fillStyle = paint.colour.primary;
			context.lineWidth = paint.drawSize * qualityMod;
			context.fillStyle = paint.colour.primary;
			context.strokeStyle = paint.colour.primary;
		}
	}

	const setListeners = () => {
		iconRef.addEventListener("mousedown", listenerHandlers.start, false);
		iconRef.addEventListener("mousemove", listenerHandlers.draw, false);
		iconRef.addEventListener("mouseup", listenerHandlers.end, false);
		iconRef.addEventListener("mousemove", listenerHandlers.drawIcon);
		iconRef.addEventListener("mouseleave", () =>
			listenerHandlers.emptyCanvas(iconRef)
		);
	};

	const listenerHandlers = {
		start: (e) => {
			imageStack.push(
				context.getImageData(0, 0, canvasRef.width, canvasRef.height)
			);
			paint.drawing = true;
			context.beginPath();
			context.moveTo(
				(e.clientX - offsetLeft) * qualityMod,
				(e.clientY - offsetTop) * qualityMod
			);
			context.lineTo(
				(e.clientX - offsetLeft) * qualityMod,
				(e.clientY - offsetTop) * qualityMod
			);
			e.preventDefault();
		},
		draw: (e) => {
			if (!paint.drawing) return;
			context.lineTo(
				(e.clientX - offsetLeft) * qualityMod,
				(e.clientY - offsetTop) * qualityMod
			);
			context.stroke();
			e.preventDefault();
		},
		end: (e) => {
			if (!paint.drawing) return;
			paint.drawing = false;
			e.preventDefault();
		},
		drawIcon: (e) => {
			let ctx = iconRef.getContext("2d");
			let img = document.getElementById("iconImage") as HTMLImageElement;
			let width = 30;
			let height = 30;
			console.log(img);
			ctx.clearRect(0, 0, iconRef.width, iconRef.height);
			ctx.drawImage(
				img,
				(e.clientX - offsetLeft) * qualityMod - width * 0.5,
				(e.clientY - offsetTop) * qualityMod - height * 0.5,
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
		return canvasRef.toDataURL("image/png");
	}

	listener.register("Control+S", () => {
		let link = document.createElement("a");
		link.download = "image.png";
		link.href = canvasRef.toDataURL();
		link.click();
	});
	listener.register("Control+Z", revert);

	function revert() {
		if (imageStack.length > 0) context.putImageData(imageStack.pop(), 0, 0);
	}
</script>

<div id="canvasDiv">
	<canvas
		id="iconCanvas"
		bind:this={iconRef}
		width="150"
		height="150"
		style="z-index: 10000;"
	/>
	<canvas id="canvas" bind:this={canvasRef} width="150" height="150" />
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
	#iconCanvas {
		position: absolute;
		left: 0px;
		top: 0px;
		image-rendering: pixelated;
		image-rendering: crisp-edges;
		width: 100%;
		height: 100%;
	}
</style>
