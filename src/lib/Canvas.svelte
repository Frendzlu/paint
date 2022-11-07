<script lang="ts">
	import { onMount } from "svelte/internal";
	import KeyListener from "../KeyListener";
	import { Drawable, IBristle } from "../Tool";

	//trial
	let pencil = new Drawable("Pencil", [new IBristle()]);
	let brush = new Drawable("Brush", [
		new IBristle(1, 0.4),
		new IBristle(0.5),
		new IBristle(0.65, 0.8),
		new IBristle(0.75, 0.7),
		new IBristle(0.85, 0.6),
		new IBristle(0.95, 0.5),
	]);

	let canvasRef: HTMLCanvasElement;
	$: context = canvasRef?.getContext("2d");
	let paint = {
		drawing: false,
		colour: { primary: "#ffae42", secondary: "#ffffff" },
		drawSize: 200,
	};

	let qualityMod = 1;

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
		canvasRef.addEventListener("mousedown", listenerHandlers.start, false);
		canvasRef.addEventListener("mousemove", listenerHandlers.draw, false);
		canvasRef.addEventListener("mouseup", listenerHandlers.end, false);
	};

	const listenerHandlers = {
		start: (e) => {
			paint.drawing = true;
			let x = (e.clientX - canvasRef.offsetLeft) * qualityMod;
			let y = (e.clientY - canvasRef.offsetTop) * qualityMod;
			brush.onStart(context, { x: x, y: y }, paint.colour);
			e.preventDefault();
		},
		draw: (e) => {
			if (!paint.drawing) return;
			let x = (e.clientX - canvasRef.offsetLeft) * qualityMod;
			let y = (e.clientY - canvasRef.offsetTop) * qualityMod;
			brush.onMove(context, { x: x, y: y }, paint.colour);
		},
		end: (e) => {
			if (!paint.drawing) return;
			paint.drawing = false;
			e.preventDefault();
		},
	};

	function getImage() {
		return canvasRef.toDataURL("image/png");
	}

	let listener = new KeyListener(false);
	listener.register("Control+Alt+S", () => console.log("My test"));
</script>

<div id="canvasDiv">
	<canvas id="canvas" bind:this={canvasRef} width="150" height="150" />
</div>

<style>
	#canvasDiv {
		width: 90vw;
		height: 80vh;
	}

	#canvas {
		image-rendering: pixelated;
		image-rendering: crisp-edges;
		width: 100%;
		height: 100%;
	}
</style>
