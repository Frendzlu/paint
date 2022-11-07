<script lang="ts">
    import { listener } from './KeyListener';
    import Canvas from './lib/Canvas.svelte';

    let size = 1
    let sizeSlider: HTMLInputElement
    let color = { primary: "#ffae42", secondary: "#ffffff" }
    $: paint = {
		drawing: false,
		colour: color,
		drawSize: updateValue(size)
	}

    let predefinedColors = [
        ["#f00", "#0f0", "#00f", "#ff0", "#f0f", "#0ff", "#000", "#fff", "#abcdef", "#fedcba"]
        //"#facade"
    ]

    let userColors = Array(10).fill(undefined)

    function coloredDiv(color: string) {
        return `background-color: ${color};`
    }

    function handleClick(e) {
        paint.colour.primary = e.target.attributes.value.value
        paint = paint
    }

    function switchColors() {
        let ref = paint.colour.primary
        color.primary = color.secondary
        color.secondary = ref
        color = color 
    }

    function userColorDef(color: string) {
        inputRef.focus();
        inputRef.click();
    }

    let inputRef: HTMLInputElement = undefined
    listener.register("X", switchColors)


    // function updateSlider() {
    //     let value = +document.getElementById('value').value,
    //         adjusted = Math.max(Math.min(value, max), min);

    //     document.getElementById('slider').value = Math.log(adjusted / min) / Math.log(base);
    // }

    function updateValue(value) {
        return (min * base ** value).toFixed(0);
    }

    const 
        min = 1,
        max = 1000
    $: steps = sizeSlider ? +sizeSlider.max : 1
    $: base = Math.pow(max / min, 1 / steps);

    //document.getElementById('value').addEventListener('change', updateSlider);
    //document.getElementById('slider').addEventListener('click', updateValue);


</script>

<main>
    <div class="row">
        <input bind:this={inputRef} type="color" style="display: none"/>
        <div class="vert">
            <div id="preDefColors">
                {#each predefinedColors as colorRow}
                    <div class="row">
                        {#each colorRow as color}
                            <div value={color} class="sus" style="{coloredDiv(color)}" on:click={handleClick}/>
                        {/each}
                    </div>
                {/each}
            </div>
            <div class="row">
                {#each userColors as color}
                    <div value={color} class="sus" style="{coloredDiv(color || "#dbdbdb")}" on:click={() => userColorDef(color)}/>
                {/each}
            </div>
        </div>
        <div id="colorDisplay">
            <div class="primaryCol" style="{coloredDiv(paint.colour.primary)}"></div>
            <div class="secondaryCol" style="{coloredDiv(paint.colour.secondary)}"></div>
        </div>
        <input type="range" bind:this={sizeSlider} bind:value={size} max="200" min="1">
    </div>
	<Canvas paint={paint}/>
</main>

<style>
    .sus {
        width: 1rem; height: 1rem; margin: 3px; border: 1px solid black
    } 
    .row {
        display: flex;
        flex-direction: row;
    }
    .vert {
        display: flex;
        flex-direction: column  ;
    }
    #colorDisplay {
        position: relative;
        margin-left: 1rem;
        width: 4rem;
    }
    .primaryCol, .secondaryCol {
        width: 2rem;
        height: 2rem;
        position: absolute;
    }

    .primaryCol {
        top: 0rem;
        left: 0rem;
        z-index: 10;
    }

    .secondaryCol {
        top: 1rem;
        left: 1rem
    }
</style>