<script lang="ts">
    import { listener } from "./KeyListener";
    import Canvas from "./lib/Canvas.svelte";

    let size = 1;
    let sizeSlider: HTMLInputElement;
    let color = { primary: "#ffae42", secondary: "#ffffff" };
    $: paint = {
        drawing: false,
        color: color,
        size: updateValue(size),
        opacity: 1,
    };

    let predefinedColors = [
        [
            "#f00",
            "#0f0",
            "#00f",
            "#ff0",
            "#f0f",
            "#0ff",
            "#000",
            "#fff",
            "#abcdef",
            "#fedcba",
        ],
        //"#facade"
    ];

    let userColors = Array(10).fill(undefined);

    function coloredDiv(color: string) {
        return `background-color: ${color};`;
    }

    function handleClick(e) {
        if (!e.target.attributes.value) {
            userColorDef("#ffffffff", e.target.id);
            return;
        }
        paint.color.primary = e.target.attributes.value.value;
        paint = paint;
    }

    function switchColors() {
        let ref = paint.color.primary;
        color.primary = color.secondary;
        color.secondary = ref;
        color = color;
    }

    function userColorDef(
        previousColor: string,
        id: number,
        usrDef: boolean = true,
        primary: boolean = true
    ) {
        function update() {
            if (usrDef) {
                userColors[id] = inputRef.value;
                userColors = userColors;
            }
            if (primary) {
                color.primary = inputRef.value;
            } else {
                color.secondary = inputRef.value;
            }
        }
        inputRef.onchange = (e) => {
            update();
        };
        inputRef.value = previousColor;
        update();
        inputRef.focus();
        inputRef.click();
    }

    let inputRef: HTMLInputElement = undefined;
    listener.registerDown("X", switchColors);

    // function updateSlider() {
    //     let value = +document.getElementById('value').value,
    //         adjusted = Math.max(Math.min(value, max), min);

    //     document.getElementById('slider').value = Math.log(adjusted / min) / Math.log(base);
    // }

    function updateValue(value) {
        return parseInt((min * base ** value).toFixed(0));
    }

    const min = 1,
        max = 1000;
    $: steps = sizeSlider ? +sizeSlider.max : 1;
    $: base = Math.pow(max / min, 1 / steps);

    //document.getElementById('value').addEventListener('change', updateSlider);
    //document.getElementById('slider').addEventListener('click', updateValue);
</script>

<main>
    <div class="row">
        <input bind:this={inputRef} type="color" style="display: none" />
        <div class="vert">
            <div id="preDefColors">
                {#each predefinedColors as colorRow}
                    <div class="row">
                        {#each colorRow as color}
                            <div
                                value={color}
                                class="sus"
                                style={coloredDiv(color)}
                                on:click={handleClick}
                                on:keydown={() => {}}
                            />
                        {/each}
                    </div>
                {/each}
            </div>
            <div class="row">
                {#each userColors as color, i}
                    <div
                        value={color}
                        id={i.toString()}
                        class="sus"
                        style={coloredDiv(color || "#dbdbdb")}
                        on:contextmenu={(e) => {
                            e.preventDefault();
                            userColorDef(color, i);
                        }}
                        on:click={handleClick}
                        on:keydown={() => {}}
                    />
                {/each}
            </div>
        </div>
        <div id="colorDisplay">
            <div
                class="primaryCol"
                style={coloredDiv(paint.color.primary)}
                on:click={() => userColorDef(paint.color.primary, 0, false)}
                on:keydown={() => {}}
            />
            <div
                class="secondaryCol"
                style={coloredDiv(paint.color.secondary)}
                on:click={() =>
                    userColorDef(paint.color.secondary, 0, false, false)}
                on:keydown={() => {}}
            />
        </div>
        <input
            type="range"
            bind:this={sizeSlider}
            bind:value={size}
            max="200"
            min="1"
        />
    </div>
    <Canvas {paint} />
</main>

<style>
    .sus {
        width: 1rem;
        height: 1rem;
        margin: 3px;
        border: 1px solid black;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
    .vert {
        display: flex;
        flex-direction: column;
    }
    #colorDisplay {
        position: relative;
        margin-left: 1rem;
        width: 4rem;
    }
    .primaryCol,
    .secondaryCol {
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
        left: 1rem;
    }
</style>
